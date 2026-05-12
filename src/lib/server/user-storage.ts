import type { Types } from "mongoose";
import { UserModel } from "./models/user";
import { hashPassword, verifyPassword } from "./auth-password";

export type PublicUser = { id: string; email: string };

export async function createUser(
  email: string,
  password: string,
): Promise<PublicUser | { error: "email_taken" }> {
  const normalized = email.trim().toLowerCase();
  const existing = await UserModel.findOne({ email: normalized }).lean();
  if (existing) {
    return { error: "email_taken" };
  }
  const doc = await UserModel.create({
    email: normalized,
    passwordHash: hashPassword(password),
  });
  return { id: doc._id.toString(), email: doc.email };
}

export async function verifyUserCredentials(
  email: string,
  password: string,
): Promise<PublicUser | null> {
  const normalized = email.trim().toLowerCase();
  const doc = await UserModel.findOne({ email: normalized }).lean();
  if (!doc) return null;
  const d = doc as { _id: Types.ObjectId; email: string; passwordHash: string };
  if (!verifyPassword(password, d.passwordHash)) return null;
  return { id: d._id.toString(), email: d.email };
}

export async function getUserById(id: string): Promise<PublicUser | null> {
  const doc = await UserModel.findById(id).lean();
  if (!doc) return null;
  const d = doc as { _id: Types.ObjectId; email: string };
  return { id: d._id.toString(), email: d.email };
}
