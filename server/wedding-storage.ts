import mongoose, { Types } from "mongoose";
import {
  RSVPModel,
  GuestModel,
  WeddingEventModel,
  ContactModel,
  SiteModel,
} from "./models";
import type { SiteAttrs } from "./models/site";
import type { RSVP, CreateRSVP, Guest, CreateGuest, WeddingEvent, CreateWeddingEvent, Contact, CreateContact } from "@shared/wedding-schema";
import type { CreateSite, PublicSite, UpdateSite } from "@shared/site-schema";

function oid(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid id");
  }
  return new Types.ObjectId(id);
}

function toRSVP(doc: Record<string, unknown>): RSVP {
  const d = doc as {
    _id: Types.ObjectId;
    siteId: Types.ObjectId;
    name: string;
    email: string;
    whatsappInvite: "yes" | "no";
    willAttend?: "yes" | "no";
    guests: number;
    message?: string;
    tableNumber?: number;
    dietaryRestrictions?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  return {
    _id: d._id.toString(),
    siteId: d.siteId.toString(),
    name: d.name,
    email: d.email,
    whatsappInvite: d.whatsappInvite,
    willAttend: d.willAttend,
    guests: d.guests ?? 1,
    message: d.message,
    tableNumber: d.tableNumber,
    dietaryRestrictions: d.dietaryRestrictions,
    createdAt: d.createdAt ?? new Date(),
    updatedAt: d.updatedAt ?? new Date(),
  };
}

function toGuest(doc: Record<string, unknown>): Guest {
  const d = doc as {
    _id: Types.ObjectId;
    siteId: Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    relationship?: string;
    inviteStatus: "pending" | "sent" | "delivered";
    rsvpStatus: "pending" | "confirmed" | "declined";
    tableNumber?: number;
    plusOne: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  return {
    _id: d._id.toString(),
    siteId: d.siteId.toString(),
    name: d.name,
    email: d.email,
    phone: d.phone,
    relationship: d.relationship,
    inviteStatus: d.inviteStatus,
    rsvpStatus: d.rsvpStatus,
    tableNumber: d.tableNumber,
    plusOne: d.plusOne ?? false,
    createdAt: d.createdAt ?? new Date(),
    updatedAt: d.updatedAt ?? new Date(),
  };
}

function toWeddingEvent(doc: Record<string, unknown>): WeddingEvent {
  const d = doc as {
    _id: Types.ObjectId;
    siteId: Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
    startTime: string;
    endTime?: string;
    location: WeddingEvent["location"];
    eventType: WeddingEvent["eventType"];
    dressCode?: string;
    isPublic: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  return {
    _id: d._id.toString(),
    siteId: d.siteId.toString(),
    title: d.title,
    description: d.description,
    date: d.date,
    startTime: d.startTime,
    endTime: d.endTime,
    location: d.location,
    eventType: d.eventType,
    dressCode: d.dressCode,
    isPublic: d.isPublic ?? true,
    createdAt: d.createdAt ?? new Date(),
    updatedAt: d.updatedAt ?? new Date(),
  };
}

function toContact(doc: Record<string, unknown>): Contact {
  const d = doc as {
    _id: Types.ObjectId;
    siteId: Types.ObjectId;
    fullName: string;
    email: string;
    phoneNumber: string;
    tableNumber?: number;
    createdAt?: Date;
    updatedAt?: Date;
  };
  return {
    _id: d._id.toString(),
    siteId: d.siteId.toString(),
    fullName: d.fullName,
    email: d.email,
    phoneNumber: d.phoneNumber,
    tableNumber: d.tableNumber,
    createdAt: d.createdAt ?? new Date(),
    updatedAt: d.updatedAt ?? new Date(),
  };
}

export interface SiteRecord {
  _id: string;
  slug: string;
  status: "draft" | "live";
  ownerUserId?: string;
  partnerOneName?: string;
  partnerTwoName?: string;
  tagline?: string;
  weddingDate?: Date | null;
  theme?: SiteAttrs["theme"];
  content?: SiteAttrs["content"];
  setupLastStep?: number;
  setupFlowVersion?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

function toSite(doc: mongoose.FlattenMaps<SiteAttrs & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }>): SiteRecord {
  return {
    _id: doc._id.toString(),
    slug: doc.slug,
    status: (doc.status as "draft" | "live") ?? "draft",
    ownerUserId: doc.ownerUserId,
    partnerOneName: doc.partnerOneName,
    partnerTwoName: doc.partnerTwoName,
    tagline: doc.tagline,
    weddingDate: doc.weddingDate ?? undefined,
    theme: doc.theme as SiteAttrs["theme"],
    content: doc.content as SiteAttrs["content"],
    setupLastStep: doc.setupLastStep,
    setupFlowVersion: doc.setupFlowVersion,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function toPublicSite(site: SiteRecord): PublicSite {
  return {
    _id: site._id,
    slug: site.slug,
    partnerOneName: site.partnerOneName,
    partnerTwoName: site.partnerTwoName,
    tagline: site.tagline,
    weddingDate: site.weddingDate ?? null,
    theme: site.theme,
    content: site.content,
    status: site.status,
  };
}

export interface IWeddingStorage {
  createSite(input: CreateSite): Promise<SiteRecord>;
  getSiteById(id: string): Promise<SiteRecord | null>;
  getSiteBySlug(slug: string): Promise<SiteRecord | null>;
  updateSite(id: string, updates: UpdateSite): Promise<SiteRecord | null>;
  listSites(): Promise<SiteRecord[]>;
  listSitesForOwner(ownerUserId: string): Promise<SiteRecord[]>;
  userOwnsSite(siteId: string, ownerUserId: string): Promise<boolean>;

  createRSVP(rsvp: CreateRSVP & { siteId: string }): Promise<RSVP>;
  getRSVPById(id: string): Promise<RSVP | null>;
  getRSVPByEmail(email: string, siteId: string): Promise<RSVP | null>;
  updateRSVP(id: string, updates: Partial<CreateRSVP & { siteId?: string }>): Promise<RSVP | null>;
  getAllRSVPs(siteId: string): Promise<RSVP[]>;
  deleteRSVP(id: string): Promise<boolean>;

  createGuest(guest: CreateGuest & { siteId: string }): Promise<Guest>;
  getGuestById(id: string): Promise<Guest | null>;
  getGuestByEmail(email: string, siteId: string): Promise<Guest | null>;
  updateGuest(id: string, updates: Partial<CreateGuest & { siteId?: string }>): Promise<Guest | null>;
  getAllGuests(siteId: string): Promise<Guest[]>;
  deleteGuest(id: string): Promise<boolean>;

  createWeddingEvent(event: CreateWeddingEvent & { siteId: string }): Promise<WeddingEvent>;
  getWeddingEventById(id: string): Promise<WeddingEvent | null>;
  updateWeddingEvent(id: string, updates: Partial<CreateWeddingEvent & { siteId?: string }>): Promise<WeddingEvent | null>;
  getAllWeddingEvents(siteId: string): Promise<WeddingEvent[]>;
  deleteWeddingEvent(id: string): Promise<boolean>;

  createContact(contact: CreateContact & { siteId: string }): Promise<Contact>;
  getContactById(id: string): Promise<Contact | null>;
  getContactByEmail(email: string, siteId: string): Promise<Contact | null>;
  updateContact(id: string, updates: Partial<CreateContact & { siteId?: string }>): Promise<Contact | null>;
  getAllContacts(siteId: string): Promise<Contact[]>;
  deleteContact(id: string): Promise<boolean>;
  searchContacts(siteId: string, query: string): Promise<Contact[]>;
}

export class MongoWeddingStorage implements IWeddingStorage {
  async createSite(input: CreateSite): Promise<SiteRecord> {
    const created = await SiteModel.create({
      slug: input.slug.toLowerCase().trim(),
      status: input.status ?? "draft",
      ownerUserId: input.ownerUserId ?? "anonymous",
      partnerOneName: input.partnerOneName,
      partnerTwoName: input.partnerTwoName,
      tagline: input.tagline,
      weddingDate: input.weddingDate,
      theme: input.theme ?? {},
      content: input.content ?? {},
      setupLastStep: input.setupLastStep ?? 1,
      setupFlowVersion: input.setupFlowVersion ?? 2,
    });
    return toSite(created.toObject());
  }

  async getSiteById(id: string): Promise<SiteRecord | null> {
    const doc = await SiteModel.findById(oid(id)).lean();
    return doc ? toSite(doc as Parameters<typeof toSite>[0]) : null;
  }

  async getSiteBySlug(slug: string): Promise<SiteRecord | null> {
    const doc = await SiteModel.findOne({ slug: slug.toLowerCase().trim() }).lean();
    return doc ? toSite(doc as Parameters<typeof toSite>[0]) : null;
  }

  async updateSite(id: string, updates: UpdateSite): Promise<SiteRecord | null> {
    const prev = await SiteModel.findById(oid(id)).lean();
    if (!prev) {
      return null;
    }
    const omitUndef = <T extends Record<string, unknown>>(o: T): Partial<T> =>
      Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;

    const prevTheme = (prev.theme as SiteAttrs["theme"]) ?? {};
    const prevContent = (prev.content as SiteAttrs["content"]) ?? {};
    const payload: Record<string, unknown> = { ...omitUndef(updates as Record<string, unknown>) };
    if (updates.theme != null) {
      payload.theme = { ...prevTheme, ...omitUndef(updates.theme as Record<string, unknown>) };
    }
    if (updates.content != null) {
      payload.content = {
        ...prevContent,
        ...omitUndef(updates.content as Record<string, unknown>),
      };
    }
    const doc = await SiteModel.findByIdAndUpdate(oid(id), { $set: payload }, { new: true }).lean();
    return doc ? toSite(doc as Parameters<typeof toSite>[0]) : null;
  }

  async listSites(): Promise<SiteRecord[]> {
    const docs = await SiteModel.find({}).sort({ updatedAt: -1 }).lean();
    return docs.map((d) => toSite(d as Parameters<typeof toSite>[0]));
  }

  async listSitesForOwner(ownerUserId: string): Promise<SiteRecord[]> {
    const docs = await SiteModel.find({ ownerUserId }).sort({ updatedAt: -1 }).lean();
    return docs.map((d) => toSite(d as Parameters<typeof toSite>[0]));
  }

  async userOwnsSite(siteId: string, ownerUserId: string): Promise<boolean> {
    const doc = await SiteModel.findById(oid(siteId)).lean();
    if (!doc) return false;
    const o = (doc as { ownerUserId?: string }).ownerUserId;
    return o === ownerUserId;
  }

  async createRSVP(rsvp: CreateRSVP & { siteId: string }): Promise<RSVP> {
    const { siteId, ...rest } = rsvp;
    const created = await RSVPModel.create({
      ...rest,
      siteId: oid(siteId),
    });
    return toRSVP(created.toObject() as Record<string, unknown>);
  }

  async getRSVPById(id: string): Promise<RSVP | null> {
    const doc = await RSVPModel.findById(oid(id)).lean();
    return doc ? toRSVP(doc as Record<string, unknown>) : null;
  }

  async getRSVPByEmail(email: string, siteId: string): Promise<RSVP | null> {
    const doc = await RSVPModel.findOne({ email, siteId: oid(siteId) }).lean();
    return doc ? toRSVP(doc as Record<string, unknown>) : null;
  }

  async updateRSVP(id: string, updates: Partial<CreateRSVP & { siteId?: string }>): Promise<RSVP | null> {
    const payload: Record<string, unknown> = { ...updates, updatedAt: new Date() };
    if (updates.siteId) {
      payload.siteId = oid(updates.siteId);
    }
    const doc = await RSVPModel.findByIdAndUpdate(oid(id), { $set: payload }, { new: true }).lean();
    return doc ? toRSVP(doc as Record<string, unknown>) : null;
  }

  async getAllRSVPs(siteId: string): Promise<RSVP[]> {
    const docs = await RSVPModel.find({ siteId: oid(siteId) }).sort({ createdAt: -1 }).lean();
    return docs.map((d) => toRSVP(d as Record<string, unknown>));
  }

  async deleteRSVP(id: string): Promise<boolean> {
    const r = await RSVPModel.deleteOne({ _id: oid(id) });
    return r.deletedCount === 1;
  }

  async createGuest(guest: CreateGuest & { siteId: string }): Promise<Guest> {
    const { siteId, ...rest } = guest;
    const created = await GuestModel.create({
      ...rest,
      siteId: oid(siteId),
    });
    return toGuest(created.toObject() as Record<string, unknown>);
  }

  async getGuestById(id: string): Promise<Guest | null> {
    const doc = await GuestModel.findById(oid(id)).lean();
    return doc ? toGuest(doc as Record<string, unknown>) : null;
  }

  async getGuestByEmail(email: string, siteId: string): Promise<Guest | null> {
    const doc = await GuestModel.findOne({ email, siteId: oid(siteId) }).lean();
    return doc ? toGuest(doc as Record<string, unknown>) : null;
  }

  async updateGuest(id: string, updates: Partial<CreateGuest & { siteId?: string }>): Promise<Guest | null> {
    const payload: Record<string, unknown> = { ...updates, updatedAt: new Date() };
    if (updates.siteId) {
      payload.siteId = oid(updates.siteId);
    }
    const doc = await GuestModel.findByIdAndUpdate(oid(id), { $set: payload }, { new: true }).lean();
    return doc ? toGuest(doc as Record<string, unknown>) : null;
  }

  async getAllGuests(siteId: string): Promise<Guest[]> {
    const docs = await GuestModel.find({ siteId: oid(siteId) }).sort({ name: 1 }).lean();
    return docs.map((d) => toGuest(d as Record<string, unknown>));
  }

  async deleteGuest(id: string): Promise<boolean> {
    const r = await GuestModel.deleteOne({ _id: oid(id) });
    return r.deletedCount === 1;
  }

  async createWeddingEvent(event: CreateWeddingEvent & { siteId: string }): Promise<WeddingEvent> {
    const { siteId, ...rest } = event;
    const created = await WeddingEventModel.create({
      ...rest,
      siteId: oid(siteId),
    });
    return toWeddingEvent(created.toObject() as Record<string, unknown>);
  }

  async getWeddingEventById(id: string): Promise<WeddingEvent | null> {
    const doc = await WeddingEventModel.findById(oid(id)).lean();
    return doc ? toWeddingEvent(doc as Record<string, unknown>) : null;
  }

  async updateWeddingEvent(id: string, updates: Partial<CreateWeddingEvent & { siteId?: string }>): Promise<WeddingEvent | null> {
    const payload: Record<string, unknown> = { ...updates, updatedAt: new Date() };
    if (updates.siteId) {
      payload.siteId = oid(updates.siteId);
    }
    const doc = await WeddingEventModel.findByIdAndUpdate(oid(id), { $set: payload }, { new: true }).lean();
    return doc ? toWeddingEvent(doc as Record<string, unknown>) : null;
  }

  async getAllWeddingEvents(siteId: string): Promise<WeddingEvent[]> {
    const docs = await WeddingEventModel.find({ siteId: oid(siteId) }).sort({ date: 1, startTime: 1 }).lean();
    return docs.map((d) => toWeddingEvent(d as Record<string, unknown>));
  }

  async deleteWeddingEvent(id: string): Promise<boolean> {
    const r = await WeddingEventModel.deleteOne({ _id: oid(id) });
    return r.deletedCount === 1;
  }

  async createContact(contact: CreateContact & { siteId: string }): Promise<Contact> {
    const { siteId, ...rest } = contact;
    const created = await ContactModel.create({
      ...rest,
      siteId: oid(siteId),
    });
    return toContact(created.toObject() as Record<string, unknown>);
  }

  async getContactById(id: string): Promise<Contact | null> {
    const doc = await ContactModel.findById(oid(id)).lean();
    return doc ? toContact(doc as Record<string, unknown>) : null;
  }

  async getContactByEmail(email: string, siteId: string): Promise<Contact | null> {
    const doc = await ContactModel.findOne({ email, siteId: oid(siteId) }).lean();
    return doc ? toContact(doc as Record<string, unknown>) : null;
  }

  async updateContact(id: string, updates: Partial<CreateContact & { siteId?: string }>): Promise<Contact | null> {
    const payload: Record<string, unknown> = { ...updates, updatedAt: new Date() };
    if (updates.siteId) {
      payload.siteId = oid(updates.siteId);
    }
    const doc = await ContactModel.findByIdAndUpdate(oid(id), { $set: payload }, { new: true }).lean();
    return doc ? toContact(doc as Record<string, unknown>) : null;
  }

  async getAllContacts(siteId: string): Promise<Contact[]> {
    const docs = await ContactModel.find({ siteId: oid(siteId) }).sort({ fullName: 1 }).lean();
    return docs.map((d) => toContact(d as Record<string, unknown>));
  }

  async deleteContact(id: string): Promise<boolean> {
    const r = await ContactModel.deleteOne({ _id: oid(id) });
    return r.deletedCount === 1;
  }

  async searchContacts(siteId: string, query: string): Promise<Contact[]> {
    const searchRegex = new RegExp(query, "i");
    const docs = await ContactModel.find({
      siteId: oid(siteId),
      $or: [
        { fullName: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phoneNumber: { $regex: searchRegex } },
      ],
    })
      .sort({ fullName: 1 })
      .lean();
    return docs.map((d) => toContact(d as Record<string, unknown>));
  }
}

export const weddingStorage = new MongoWeddingStorage();
