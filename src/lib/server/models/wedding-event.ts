import mongoose, { Schema, type InferSchemaType } from "mongoose";

const locationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

const weddingEventSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    location: { type: locationSchema, required: true },
    eventType: {
      type: String,
      enum: ["ceremony", "reception", "rehearsal", "party", "other"],
      required: true,
    },
    dressCode: { type: String },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

weddingEventSchema.index({ siteId: 1, date: 1, startTime: 1 });

export type WeddingEventDocument = InferSchemaType<typeof weddingEventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const WeddingEventModel =
  mongoose.models.WeddingEvent ||
  mongoose.model<WeddingEventDocument>("WeddingEvent", weddingEventSchema, "wedding_events");
