import { z } from "zod";

// RSVP Schema
export const rsvpSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  whatsappInvite: z.enum(["yes", "no"]),
  willAttend: z.enum(["yes", "no"]).optional(),
  guests: z.number().min(1).max(10).default(1),
  message: z.string().optional(),
  tableNumber: z.number().optional(),
  dietaryRestrictions: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createRSVPSchema = rsvpSchema.omit({ _id: true, createdAt: true, updatedAt: true });

// Guest Schema
export const guestSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required").optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(), // friend, family, colleague, etc.
  inviteStatus: z.enum(["pending", "sent", "delivered"]).default("pending"),
  rsvpStatus: z.enum(["pending", "confirmed", "declined"]).default("pending"),
  tableNumber: z.number().optional(),
  plusOne: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createGuestSchema = guestSchema.omit({ _id: true, createdAt: true, updatedAt: true });

// Wedding Event Schema
export const weddingEventSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date(),
  startTime: z.string(), // "14:30"
  endTime: z.string().optional(),
  location: z.object({
    name: z.string(),
    address: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  eventType: z.enum(["ceremony", "reception", "rehearsal", "party", "other"]),
  dressCode: z.string().optional(),
  isPublic: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createWeddingEventSchema = weddingEventSchema.omit({ _id: true, createdAt: true, updatedAt: true });

// Type exports
export type RSVP = z.infer<typeof rsvpSchema>;
export type CreateRSVP = z.infer<typeof createRSVPSchema>;
export type Guest = z.infer<typeof guestSchema>;
export type CreateGuest = z.infer<typeof createGuestSchema>;
export type WeddingEvent = z.infer<typeof weddingEventSchema>;
export type CreateWeddingEvent = z.infer<typeof createWeddingEventSchema>;

// API Response schemas
export const rsvpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: rsvpSchema.optional(),
});

export const guestListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(guestSchema).optional(),
  total: z.number().optional(),
});

export const weddingEventsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(weddingEventSchema).optional(),
});

export type RSVPResponse = z.infer<typeof rsvpResponseSchema>;
export type GuestListResponse = z.infer<typeof guestListResponseSchema>;
export type WeddingEventsResponse = z.infer<typeof weddingEventsResponseSchema>;

// Contact Schema
export const contactSchema = z.object({
  _id: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createContactSchema = contactSchema.omit({ _id: true, createdAt: true, updatedAt: true });

export type Contact = z.infer<typeof contactSchema>;
export type CreateContact = z.infer<typeof createContactSchema>;

// Contact API Response schemas
export const contactResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: contactSchema.optional(),
});

export const contactListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(contactSchema).optional(),
  total: z.number().optional(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;
export type ContactListResponse = z.infer<typeof contactListResponseSchema>;