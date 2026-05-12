import mongoose, { Schema, type InferSchemaType } from "mongoose";

const rsvpSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsappInvite: { type: String, enum: ["yes", "no"], required: true },
    willAttend: { type: String, enum: ["yes", "no"] },
    guests: { type: Number, min: 1, max: 10, default: 1 },
    message: { type: String },
    tableNumber: { type: Number },
    dietaryRestrictions: { type: String },
  },
  { timestamps: true }
);

rsvpSchema.index({ siteId: 1, email: 1 }, { unique: true });

export type RSVPDocument = InferSchemaType<typeof rsvpSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const RSVPModel =
  mongoose.models.RSVP || mongoose.model<RSVPDocument>("RSVP", rsvpSchema, "rsvps");
