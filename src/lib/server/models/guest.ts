import mongoose, { Schema, type InferSchemaType } from "mongoose";

const guestSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    relationship: { type: String },
    inviteStatus: {
      type: String,
      enum: ["pending", "sent", "delivered"],
      default: "pending",
    },
    rsvpStatus: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
    },
    tableNumber: { type: Number },
    plusOne: { type: Boolean, default: false },
  },
  { timestamps: true }
);

guestSchema.index({ siteId: 1 });

export type GuestDocument = InferSchemaType<typeof guestSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GuestModel =
  mongoose.models.Guest || mongoose.model<GuestDocument>("Guest", guestSchema, "guests");
