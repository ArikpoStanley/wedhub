import type { Express } from "express";
import type { Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { Types } from "mongoose";
import { weddingStorage, toPublicSite } from "./wedding-storage";
import { connectMongoose } from "./mongoose-db";
import { registerAuthRoutes } from "./register-auth";
import { getSessionUserId, requireAuth, requireSiteOwner } from "./route-guards";
import { ensureCloudinaryConfigured, uploadImageBuffer } from "./cloudinary-upload";
import {
  createRSVPSchema,
  createGuestSchema,
  createWeddingEventSchema,
  createContactSchema,
} from "@shared/wedding-schema";
import { createSiteSchema, updateSiteSchema } from "@shared/site-schema";
import { buildUniqueSlugCandidates } from "./slug-utils";
import { z } from "zod";

async function resolveSiteIdFromRequest(req: Request): Promise<string | null> {
  const bodySid = typeof req.body?.siteId === "string" ? req.body.siteId : undefined;
  const querySid = typeof req.query.siteId === "string" ? req.query.siteId : undefined;
  const siteSlug = typeof req.query.site === "string" ? req.query.site : undefined;
  for (const id of [bodySid, querySid]) {
    if (id && Types.ObjectId.isValid(id)) {
      const site = await weddingStorage.getSiteById(id);
      if (site) return site._id;
    }
  }
  if (siteSlug) {
    const site = await weddingStorage.getSiteBySlug(siteSlug);
    if (site) return site._id;
  }
  return null;
}

async function listSiteIdFromQuery(req: Request): Promise<string | null> {
  const q = typeof req.query.siteId === "string" ? req.query.siteId : undefined;
  if (q && Types.ObjectId.isValid(q)) {
    const site = await weddingStorage.getSiteById(q);
    if (site) return site._id;
  }
  const slug = typeof req.query.slug === "string" ? req.query.slug : undefined;
  if (slug) {
    const site = await weddingStorage.getSiteBySlug(slug);
    if (site) return site._id;
  }
  return null;
}

function isDuplicateKeyError(err: unknown): boolean {
  return Boolean(
    err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: number }).code === 11000
  );
}

const siteImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  await connectMongoose();
  registerAuthRoutes(app);

  // --- Sites (tenant) ---
  app.get("/api/public/sites/:slug", async (req, res) => {
    try {
      const site = await weddingStorage.getSiteBySlug(req.params.slug);
      if (!site) {
        return res.status(404).json({
          success: false,
          message: "Site not found",
        });
      }
      res.json({
        success: true,
        message: "Site loaded",
        data: toPublicSite(site),
      });
    } catch (error) {
      console.error("Error loading public site:", error);
      res.status(500).json({ success: false, message: "Failed to load site" });
    }
  });

  app.get("/api/sites/suggest-slug", async (req, res) => {
    try {
      if (!requireAuth(req, res)) return;
      const partnerOne = String(req.query.partnerOne ?? "").trim();
      const partnerTwo = String(req.query.partnerTwo ?? "").trim();
      if (!partnerOne || !partnerTwo) {
        return res.status(400).json({
          success: false,
          message: "partnerOne and partnerTwo query params are required",
        });
      }
      const candidates = buildUniqueSlugCandidates(partnerOne, partnerTwo);
      let suggested = candidates[0] ?? "wedding";
      const taken: string[] = [];
      for (const c of candidates) {
        const existing = await weddingStorage.getSiteBySlug(c);
        if (!existing) {
          suggested = c;
          return res.json({
            success: true,
            data: { suggested, candidates, taken },
          });
        }
        taken.push(c);
      }
      suggested = `${candidates[0]}-${Math.random().toString(36).slice(2, 6)}`;
      res.json({
        success: true,
        data: { suggested, candidates: [...candidates, suggested], taken },
      });
    } catch (error) {
      console.error("Error suggesting slug:", error);
      res.status(500).json({ success: false, message: "Failed to suggest slug" });
    }
  });

  app.get("/api/sites", async (req, res) => {
    try {
      const uid = requireAuth(req, res);
      if (!uid) return;
      const sites = await weddingStorage.listSitesForOwner(uid);
      res.json({ success: true, message: "Sites retrieved", data: sites });
    } catch (error) {
      console.error("Error listing sites:", error);
      res.status(500).json({ success: false, message: "Failed to list sites" });
    }
  });

  app.get("/api/sites/:id", async (req, res) => {
    try {
      const uid = requireAuth(req, res);
      if (!uid) return;
      const site = await weddingStorage.getSiteById(req.params.id);
      if (!site) {
        return res.status(404).json({ success: false, message: "Site not found" });
      }
      if (site.ownerUserId !== uid) {
        return res.status(403).json({ success: false, message: "You do not have access to this site" });
      }
      res.json({ success: true, message: "Site retrieved", data: site });
    } catch (error) {
      console.error("Error fetching site:", error);
      res.status(500).json({ success: false, message: "Failed to fetch site" });
    }
  });

  app.post("/api/sites", async (req, res) => {
    try {
      const uid = requireAuth(req, res);
      if (!uid) return;
      const validated = createSiteSchema.parse(req.body);
      const site = await weddingStorage.createSite({ ...validated, ownerUserId: uid });
      res.status(201).json({
        success: true,
        message: "Site created",
        data: site,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data",
          errors: error.errors,
        });
      }
      if (isDuplicateKeyError(error)) {
        return res.status(409).json({
          success: false,
          message: "Slug already in use",
        });
      }
      console.error("Error creating site:", error);
      res.status(500).json({ success: false, message: "Failed to create site" });
    }
  });

  app.put("/api/sites/:id", async (req, res) => {
    try {
      if (!(await requireSiteOwner(req, res, req.params.id))) return;
      const updates = updateSiteSchema.parse(req.body);
      const site = await weddingStorage.updateSite(req.params.id, updates);
      if (!site) {
        return res.status(404).json({ success: false, message: "Site not found" });
      }
      res.json({ success: true, message: "Site updated", data: site });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data",
          errors: error.errors,
        });
      }
      console.error("Error updating site:", error);
      res.status(500).json({ success: false, message: "Failed to update site" });
    }
  });

  /** Multipart field name: `images` (repeat for multiple files). Query: `kind=gallery` | `kind=hero`. */
  app.post(
    "/api/sites/:siteId/media",
    (req, res, next) => {
      if (!getSessionUserId(req)) {
        res.status(401).json({ success: false, message: "Sign in to continue" });
        return;
      }
      next();
    },
    siteImageUpload.array("images", 30),
    async (req, res) => {
      try {
        if (!(await requireSiteOwner(req, res, req.params.siteId))) return;
        if (!ensureCloudinaryConfigured()) {
          return res.status(503).json({
            success: false,
            message:
              "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment.",
          });
        }
        const files = req.files as Express.Multer.File[] | undefined;
        if (!files?.length) {
          return res.status(400).json({
            success: false,
            message: "No image files received. Use the field name “images” in the form.",
          });
        }
        const site = await weddingStorage.getSiteById(req.params.siteId);
        if (!site) {
          return res.status(404).json({ success: false, message: "Site not found" });
        }
        const kind = req.query.kind === "hero" ? "hero" : "gallery";
        const subfolder = `sites/${site.slug}/${kind}`;
        const urls: string[] = [];
        for (const file of files) {
          urls.push(await uploadImageBuffer(file.buffer, subfolder));
        }
        res.json({ success: true, message: "Uploaded", data: { urls } });
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "Upload failed",
        });
      }
    },
  );

  // RSVP Routes
  app.post("/api/rsvp", async (req, res) => {
    try {
      const validatedData = createRSVPSchema.parse(req.body);
      const siteId = validatedData.siteId;
      const existingRSVP = await weddingStorage.getRSVPByEmail(validatedData.email, siteId);
      if (existingRSVP) {
        return res.status(400).json({
          success: false,
          message: "RSVP already exists for this email address on this site",
        });
      }
      const { siteId: _drop, ...rest } = validatedData;
      const rsvp = await weddingStorage.createRSVP({ ...rest, siteId });
      res.status(201).json({
        success: true,
        message: "RSVP submitted successfully",
        data: rsvp,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors,
        });
      }
      if (isDuplicateKeyError(error)) {
        return res.status(400).json({
          success: false,
          message: "RSVP already exists for this email address on this site",
        });
      }
      console.error("Error creating RSVP:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit RSVP",
      });
    }
  });

  app.get("/api/rsvp/:id", async (req, res) => {
    try {
      const rsvp = await weddingStorage.getRSVPById(req.params.id);
      if (!rsvp) {
        return res.status(404).json({
          success: false,
          message: "RSVP not found",
        });
      }
      const rsvpSiteId = rsvp.siteId;
      if (!rsvpSiteId) {
        return res.status(400).json({ success: false, message: "Invalid RSVP record" });
      }
      if (!(await requireSiteOwner(req, res, rsvpSiteId))) return;
      res.json({
        success: true,
        message: "RSVP retrieved successfully",
        data: rsvp,
      });
    } catch (error) {
      console.error("Error fetching RSVP:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch RSVP",
      });
    }
  });

  app.get("/api/rsvps", async (req, res) => {
    try {
      const siteId = await listSiteIdFromQuery(req);
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "Provide siteId or slug as a query parameter",
        });
      }
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const rsvps = await weddingStorage.getAllRSVPs(siteId);
      res.json({
        success: true,
        message: "RSVPs retrieved successfully",
        data: rsvps,
        total: rsvps.length,
      });
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch RSVPs",
      });
    }
  });

  app.put("/api/rsvp/:id", async (req, res) => {
    try {
      const existing = await weddingStorage.getRSVPById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "RSVP not found" });
      }
      const existingSiteId = existing.siteId;
      if (!existingSiteId) {
        return res.status(400).json({ success: false, message: "Invalid RSVP record" });
      }
      if (!(await requireSiteOwner(req, res, existingSiteId))) return;
      const updates = createRSVPSchema.partial().parse(req.body);
      const rsvp = await weddingStorage.updateRSVP(req.params.id, updates);
      if (!rsvp) {
        return res.status(404).json({
          success: false,
          message: "RSVP not found",
        });
      }
      res.json({
        success: true,
        message: "RSVP updated successfully",
        data: rsvp,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors,
        });
      }
      console.error("Error updating RSVP:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update RSVP",
      });
    }
  });

  // Guest Routes
  app.post("/api/guests", async (req, res) => {
    try {
      const validatedData = createGuestSchema.parse(req.body);
      const siteId = validatedData.siteId ?? (await resolveSiteIdFromRequest(req));
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "siteId is required in the body, or pass site / siteId as query parameters",
        });
      }
      const { siteId: _s, ...rest } = validatedData;
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const guest = await weddingStorage.createGuest({ ...rest, siteId });
      res.status(201).json({
        success: true,
        message: "Guest created successfully",
        data: guest,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors,
        });
      }
      console.error("Error creating guest:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create guest",
      });
    }
  });

  app.get("/api/guests", async (req, res) => {
    try {
      const siteId = await listSiteIdFromQuery(req);
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "Provide siteId or slug as a query parameter",
        });
      }
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const guests = await weddingStorage.getAllGuests(siteId);
      res.json({
        success: true,
        message: "Guests retrieved successfully",
        data: guests,
        total: guests.length,
      });
    } catch (error) {
      console.error("Error fetching guests:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch guests",
      });
    }
  });

  app.get("/api/guests/:id", async (req, res) => {
    try {
      const guest = await weddingStorage.getGuestById(req.params.id);
      if (!guest) {
        return res.status(404).json({
          success: false,
          message: "Guest not found",
        });
      }
      const guestSiteId = guest.siteId;
      if (!guestSiteId) {
        return res.status(400).json({ success: false, message: "Invalid guest record" });
      }
      if (!(await requireSiteOwner(req, res, guestSiteId))) return;
      res.json({
        success: true,
        message: "Guest retrieved successfully",
        data: guest,
      });
    } catch (error) {
      console.error("Error fetching guest:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch guest",
      });
    }
  });

  // Wedding Events Routes
  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = createWeddingEventSchema.parse(req.body);
      const siteId = validatedData.siteId ?? (await resolveSiteIdFromRequest(req));
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "siteId is required in the body, or pass site / siteId as query parameters",
        });
      }
      const { siteId: _s, ...rest } = validatedData;
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const event = await weddingStorage.createWeddingEvent({ ...rest, siteId });
      res.status(201).json({
        success: true,
        message: "Wedding event created successfully",
        data: event,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors,
        });
      }
      console.error("Error creating wedding event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create wedding event",
      });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const siteId = await listSiteIdFromQuery(req);
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "Provide siteId or slug as a query parameter",
        });
      }
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const events = await weddingStorage.getAllWeddingEvents(siteId);
      res.json({
        success: true,
        message: "Wedding events retrieved successfully",
        data: events,
      });
    } catch (error) {
      console.error("Error fetching wedding events:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch wedding events",
      });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await weddingStorage.getWeddingEventById(req.params.id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Wedding event not found",
        });
      }
      const eventSiteId = event.siteId;
      if (!eventSiteId) {
        return res.status(400).json({ success: false, message: "Invalid event record" });
      }
      if (!(await requireSiteOwner(req, res, eventSiteId))) return;
      res.json({
        success: true,
        message: "Wedding event retrieved successfully",
        data: event,
      });
    } catch (error) {
      console.error("Error fetching wedding event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch wedding event",
      });
    }
  });

  // Contact Routes
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = createContactSchema.parse(req.body);
      const siteId = validatedData.siteId ?? (await resolveSiteIdFromRequest(req));
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "siteId is required in the body, or pass site / siteId as query parameters",
        });
      }
      const existingContact = await weddingStorage.getContactByEmail(validatedData.email, siteId);
      if (existingContact) {
        return res.status(400).json({
          success: false,
          message: "Contact already exists for this email address on this site",
        });
      }
      const { siteId: _s, ...rest } = validatedData;
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const contact = await weddingStorage.createContact({ ...rest, siteId });
      res.status(201).json({
        success: true,
        message: "Contact created successfully",
        data: contact,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors,
        });
      }
      if (isDuplicateKeyError(error)) {
        return res.status(400).json({
          success: false,
          message: "Contact already exists for this email address on this site",
        });
      }
      console.error("Error creating contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create contact",
      });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const siteId = await listSiteIdFromQuery(req);
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "Provide siteId or slug as a query parameter",
        });
      }
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const contacts = await weddingStorage.getAllContacts(siteId);
      res.json({
        success: true,
        message: "Contacts retrieved successfully",
        data: contacts,
        total: contacts.length,
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contacts",
      });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await weddingStorage.getContactById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }
      const contactSiteId = contact.siteId;
      if (!contactSiteId) {
        return res.status(400).json({ success: false, message: "Invalid contact record" });
      }
      if (!(await requireSiteOwner(req, res, contactSiteId))) return;
      res.json({
        success: true,
        message: "Contact retrieved successfully",
        data: contact,
      });
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contact",
      });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const prev = await weddingStorage.getContactById(req.params.id);
      if (!prev) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      const prevContactSiteId = prev.siteId;
      if (!prevContactSiteId) {
        return res.status(400).json({ success: false, message: "Invalid contact record" });
      }
      if (!(await requireSiteOwner(req, res, prevContactSiteId))) return;
      const updates = createContactSchema.partial().parse(req.body);
      const contact = await weddingStorage.updateContact(req.params.id, updates);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }
      res.json({
        success: true,
        message: "Contact updated successfully",
        data: contact,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors,
        });
      }
      console.error("Error updating contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update contact",
      });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const prev = await weddingStorage.getContactById(req.params.id);
      if (!prev) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      const delContactSiteId = prev.siteId;
      if (!delContactSiteId) {
        return res.status(400).json({ success: false, message: "Invalid contact record" });
      }
      if (!(await requireSiteOwner(req, res, delContactSiteId))) return;
      const success = await weddingStorage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }
      res.json({
        success: true,
        message: "Contact deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete contact",
      });
    }
  });

  app.get("/api/contacts/search/:query", async (req, res) => {
    try {
      const query = req.params.query.toLowerCase().trim();
      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }
      const siteId = await listSiteIdFromQuery(req);
      if (!siteId) {
        return res.status(400).json({
          success: false,
          message: "Provide siteId or slug as a query parameter",
        });
      }
      if (!(await requireSiteOwner(req, res, siteId))) return;
      const contacts = await weddingStorage.searchContacts(siteId, query);
      res.json({
        success: true,
        message: `Found ${contacts.length} matching contacts`,
        data: contacts,
        total: contacts.length,
      });
    } catch (error) {
      console.error("Error searching contacts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search contacts",
      });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      message: "Wedding API is running",
      timestamp: new Date().toISOString(),
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
