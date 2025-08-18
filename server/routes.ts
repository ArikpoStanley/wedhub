import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { weddingStorage } from "./wedding-storage";
import { connectToMongoDB } from "./mongodb";
import { createRSVPSchema, createGuestSchema, createWeddingEventSchema, createContactSchema } from "@shared/wedding-schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MongoDB connection
  await connectToMongoDB();

  // RSVP Routes
  app.post("/api/rsvp", async (req, res) => {
    try {
      const validatedData = createRSVPSchema.parse(req.body);
      
      // Check if RSVP already exists for this email
      const existingRSVP = await weddingStorage.getRSVPByEmail(validatedData.email);
      if (existingRSVP) {
        return res.status(400).json({
          success: false,
          message: "RSVP already exists for this email address"
        });
      }

      const rsvp = await weddingStorage.createRSVP(validatedData);
      res.status(201).json({
        success: true,
        message: "RSVP submitted successfully",
        data: rsvp
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors
        });
      }
      console.error("Error creating RSVP:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit RSVP"
      });
    }
  });

  app.get("/api/rsvp/:id", async (req, res) => {
    try {
      const rsvp = await weddingStorage.getRSVPById(req.params.id);
      if (!rsvp) {
        return res.status(404).json({
          success: false,
          message: "RSVP not found"
        });
      }
      res.json({
        success: true,
        message: "RSVP retrieved successfully",
        data: rsvp
      });
    } catch (error) {
      console.error("Error fetching RSVP:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch RSVP"
      });
    }
  });

  app.get("/api/rsvps", async (req, res) => {
    try {
      const rsvps = await weddingStorage.getAllRSVPs();
      res.json({
        success: true,
        message: "RSVPs retrieved successfully",
        data: rsvps,
        total: rsvps.length
      });
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch RSVPs"
      });
    }
  });

  app.put("/api/rsvp/:id", async (req, res) => {
    try {
      const updates = createRSVPSchema.partial().parse(req.body);
      const rsvp = await weddingStorage.updateRSVP(req.params.id, updates);
      if (!rsvp) {
        return res.status(404).json({
          success: false,
          message: "RSVP not found"
        });
      }
      res.json({
        success: true,
        message: "RSVP updated successfully",
        data: rsvp
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors
        });
      }
      console.error("Error updating RSVP:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update RSVP"
      });
    }
  });

  // Guest Routes
  app.post("/api/guests", async (req, res) => {
    try {
      const validatedData = createGuestSchema.parse(req.body);
      const guest = await weddingStorage.createGuest(validatedData);
      res.status(201).json({
        success: true,
        message: "Guest created successfully",
        data: guest
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors
        });
      }
      console.error("Error creating guest:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create guest"
      });
    }
  });

  app.get("/api/guests", async (req, res) => {
    try {
      const guests = await weddingStorage.getAllGuests();
      res.json({
        success: true,
        message: "Guests retrieved successfully",
        data: guests,
        total: guests.length
      });
    } catch (error) {
      console.error("Error fetching guests:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch guests"
      });
    }
  });

  app.get("/api/guests/:id", async (req, res) => {
    try {
      const guest = await weddingStorage.getGuestById(req.params.id);
      if (!guest) {
        return res.status(404).json({
          success: false,
          message: "Guest not found"
        });
      }
      res.json({
        success: true,
        message: "Guest retrieved successfully",
        data: guest
      });
    } catch (error) {
      console.error("Error fetching guest:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch guest"
      });
    }
  });

  // Wedding Events Routes
  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = createWeddingEventSchema.parse(req.body);
      const event = await weddingStorage.createWeddingEvent(validatedData);
      res.status(201).json({
        success: true,
        message: "Wedding event created successfully",
        data: event
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors
        });
      }
      console.error("Error creating wedding event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create wedding event"
      });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await weddingStorage.getAllWeddingEvents();
      res.json({
        success: true,
        message: "Wedding events retrieved successfully",
        data: events
      });
    } catch (error) {
      console.error("Error fetching wedding events:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch wedding events"
      });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await weddingStorage.getWeddingEventById(req.params.id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Wedding event not found"
        });
      }
      res.json({
        success: true,
        message: "Wedding event retrieved successfully",
        data: event
      });
    } catch (error) {
      console.error("Error fetching wedding event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch wedding event"
      });
    }
  });

  // Contact Routes
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = createContactSchema.parse(req.body);
      
      // Check if contact already exists for this email
      const existingContact = await weddingStorage.getContactByEmail(validatedData.email);
      if (existingContact) {
        return res.status(400).json({
          success: false,
          message: "Contact already exists for this email address"
        });
      }

      const contact = await weddingStorage.createContact(validatedData);
      res.status(201).json({
        success: true,
        message: "Contact created successfully",
        data: contact
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors
        });
      }
      console.error("Error creating contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create contact"
      });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await weddingStorage.getAllContacts();
      res.json({
        success: true,
        message: "Contacts retrieved successfully",
        data: contacts,
        total: contacts.length
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contacts"
      });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await weddingStorage.getContactById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found"
        });
      }
      res.json({
        success: true,
        message: "Contact retrieved successfully",
        data: contact
      });
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contact"
      });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const updates = createContactSchema.partial().parse(req.body);
      const contact = await weddingStorage.updateContact(req.params.id, updates);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found"
        });
      }
      res.json({
        success: true,
        message: "Contact updated successfully",
        data: contact
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided",
          errors: error.errors
        });
      }
      console.error("Error updating contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update contact"
      });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await weddingStorage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Contact not found"
        });
      }
      res.json({
        success: true,
        message: "Contact deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete contact"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Wedding API is running",
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
