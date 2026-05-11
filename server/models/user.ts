import mongoose, { Schema } from "mongoose";

export interface UserAttrs {
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<UserAttrs>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type UserDocument = mongoose.HydratedDocument<UserAttrs>;

export const UserModel =
  mongoose.models.User || mongoose.model<UserAttrs>("User", userSchema);
