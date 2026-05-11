import mongoose, { Schema } from "mongoose";

export interface DressCodeColorEntry {
  name: string;
  hex: string;
}

export interface SiteTheme {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  dressCodeColors?: DressCodeColorEntry[];
}

export interface SiteContent {
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  coupleDisplayName?: string;
  storyHeading?: string;
  storyBody?: string;
  heroImageUrls?: string[];
  galleryImageUrls?: string[];
  /** Chosen full-bleed home hero photo (must be one of gallery or hero URLs). */
  homeHeroBackgroundImageUrl?: string;
  venueName?: string;
  venueAddress?: string;

  registryGiftTitle?: string;
  registryGiftBody?: string;
  registryAccountHeading?: string;
  registryAccountName?: string;
  registryAccountNumber?: string;
  registryBankName?: string;
  registryClosingTitle?: string;
  registryClosingBody?: string;

  ceremonyTitle?: string;
  ceremonyDescription?: string;
  ceremonyDateDisplay?: string;
  ceremonyTime?: string;
  ceremonyRsvpPhone?: string;
  ceremonyLocation?: string;
  ceremonyDirectionsUrl?: string;

  receptionTitle?: string;
  receptionDescription?: string;
  receptionDateDisplay?: string;
  receptionTime?: string;
  receptionRsvpPhone?: string;
  receptionLocation?: string;
  receptionDirectionsUrl?: string;

  schedulePageBackgroundImageUrl?: string;

  mapsDirectionsUrl?: string;
  calendarEventTitle?: string;
  calendarEventDescription?: string;
  calendarEventLocation?: string;
  calendarStartIso?: string;
  calendarEndIso?: string;
  calendarGoogleUrlOverride?: string;
  orderOfServiceUrl?: string;

  actionBarProgrammeLabel?: string;
  actionBarCalendarLabel?: string;
  actionBarDirectionsLabel?: string;

  footerMarqueeLead?: string;
  footerPhone?: string;
  footerEmail?: string;
  footerCreditLine?: string;
}

export interface SiteAttrs {
  slug: string;
  status?: "draft" | "live";
  ownerUserId?: string;
  partnerOneName?: string;
  partnerTwoName?: string;
  tagline?: string;
  weddingDate?: Date;
  theme?: SiteTheme;
  content?: SiteContent;
  /** Resume guided setup (client step index). */
  setupLastStep?: number;
  /** 2 = current 8-step flow; missing/1 = legacy 6-step. */
  setupFlowVersion?: number;
}

const siteSchema = new Schema<SiteAttrs>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["draft", "live"], default: "draft" },
    ownerUserId: { type: String, default: "anonymous" },
    partnerOneName: { type: String, default: "" },
    partnerTwoName: { type: String, default: "" },
    tagline: { type: String },
    weddingDate: { type: Date },
    theme: { type: Schema.Types.Mixed, default: () => ({}) },
    content: { type: Schema.Types.Mixed, default: () => ({}) },
    setupLastStep: { type: Number, default: 0 },
    setupFlowVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

siteSchema.index({ ownerUserId: 1 });

export type SiteDocument = mongoose.HydratedDocument<SiteAttrs>;

export const SiteModel =
  mongoose.models.Site || mongoose.model<SiteAttrs>("Site", siteSchema);
