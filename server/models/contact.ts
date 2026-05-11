import mongoose, { Schema, type InferSchemaType } from "mongoose";

const contactSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    tableNumber: { type: Number, min: 1, max: 50 },
  },
  { timestamps: true }
);

contactSchema.index({ siteId: 1, email: 1 }, { unique: true });
contactSchema.index({ siteId: 1, fullName: 1 });

export type ContactDocument = InferSchemaType<typeof contactSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ContactModel =
  mongoose.models.Contact ||
  mongoose.model<ContactDocument>("Contact", contactSchema, "contacts");
