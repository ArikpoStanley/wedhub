import { z } from "zod";

export const dressCodeColorEntrySchema = z.object({
  name: z.string().min(1).max(80),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const siteThemeSchema = z.object({
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  /** Up to three “colours of the day” (name + resolved hex). */
  dressCodeColors: z.array(dressCodeColorEntrySchema).max(3).optional(),
});

export type SiteTheme = z.infer<typeof siteThemeSchema>;
export type DressCodeColorEntry = z.infer<typeof dressCodeColorEntrySchema>;

const optionalLong = z.string().max(8000).optional();

export const siteContentSchema = z.object({
  heroHeadingLine1: z.string().optional(),
  heroHeadingLine2: z.string().optional(),
  coupleDisplayName: z.string().optional(),
  storyHeading: z.string().optional(),
  storyBody: z.string().optional(),
  heroImageUrls: z.array(z.string()).optional(),
  galleryImageUrls: z.array(z.string()).optional(),
  /** Full-bleed home hero; must match a URL in gallery or hero lists (enforced in admin). */
  homeHeroBackgroundImageUrl: z.string().max(2048).optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),

  /** Registry / gifts */
  registryGiftTitle: optionalLong,
  registryGiftBody: optionalLong,
  registryAccountHeading: optionalLong,
  registryAccountName: optionalLong,
  registryAccountNumber: optionalLong,
  registryBankName: optionalLong,
  registryClosingTitle: optionalLong,
  registryClosingBody: optionalLong,

  /** Schedule page — ceremony */
  ceremonyTitle: optionalLong,
  ceremonyDescription: optionalLong,
  ceremonyDateDisplay: optionalLong,
  ceremonyTime: optionalLong,
  ceremonyRsvpPhone: optionalLong,
  ceremonyLocation: optionalLong,
  ceremonyDirectionsUrl: optionalLong,

  /** Schedule page — reception */
  receptionTitle: optionalLong,
  receptionDescription: optionalLong,
  receptionDateDisplay: optionalLong,
  receptionTime: optionalLong,
  receptionRsvpPhone: optionalLong,
  receptionLocation: optionalLong,
  receptionDirectionsUrl: optionalLong,

  /** Schedule page background (image URL) */
  schedulePageBackgroundImageUrl: optionalLong,

  /** Home quick actions (floating bar + modal) */
  mapsDirectionsUrl: optionalLong,
  calendarEventTitle: optionalLong,
  calendarEventDescription: optionalLong,
  calendarEventLocation: optionalLong,
  /** ISO datetime strings (e.g. from datetime-local) for Google Calendar link */
  calendarStartIso: optionalLong,
  calendarEndIso: optionalLong,
  /** Optional full Google Calendar URL — if set, used instead of building from ISO fields */
  calendarGoogleUrlOverride: optionalLong,
  orderOfServiceUrl: optionalLong,

  actionBarProgrammeLabel: z.string().max(80).optional(),
  actionBarCalendarLabel: z.string().max(80).optional(),
  actionBarDirectionsLabel: z.string().max(80).optional(),

  /** Footer marquee segments */
  footerMarqueeLead: optionalLong,
  footerPhone: optionalLong,
  footerEmail: optionalLong,
  footerCreditLine: optionalLong,
});

export const createSiteSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(64),
  status: z.enum(["draft", "live"]).optional(),
  ownerUserId: z.string().optional(),
  partnerOneName: z.string().optional(),
  partnerTwoName: z.string().optional(),
  tagline: z.string().optional(),
  weddingDate: z.coerce.date().optional(),
  theme: siteThemeSchema.optional(),
  content: siteContentSchema.optional(),
  /** 2 = current multi-step setup flow (used to interpret setupLastStep). */
  setupFlowVersion: z.number().int().optional(),
  setupLastStep: z.number().int().min(0).max(30).optional(),
});

export const updateSiteSchema = createSiteSchema.partial().omit({ slug: true });

export const publicSiteSchema = z.object({
  _id: z.string(),
  slug: z.string(),
  partnerOneName: z.string().optional(),
  partnerTwoName: z.string().optional(),
  tagline: z.string().optional(),
  weddingDate: z.coerce.date().optional().nullable(),
  theme: siteThemeSchema.optional(),
  content: siteContentSchema.optional(),
  status: z.enum(["draft", "live"]),
});

export const siteRecordSchema = publicSiteSchema.extend({
  ownerUserId: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  setupFlowVersion: z.number().int().optional(),
  setupLastStep: z.number().int().optional(),
});

export type CreateSite = z.infer<typeof createSiteSchema>;
export type UpdateSite = z.infer<typeof updateSiteSchema>;
export type PublicSite = z.infer<typeof publicSiteSchema>;
/** Full site row (admin / API), including fields not exposed on the public guest endpoint. */
export type SiteRecord = z.infer<typeof siteRecordSchema>;
