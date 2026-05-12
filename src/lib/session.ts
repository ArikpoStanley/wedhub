import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type WeddingSession = {
  userId?: string;
};

declare module "iron-session" {
  interface IronSessionData extends WeddingSession {}
}

function sessionPassword(): string {
  const p = process.env.SESSION_SECRET?.trim() || "";
  if (p.length >= 32) return p;
  if (process.env.NODE_ENV === "development") {
    return `${p}dev-session-secret-min-32-chars!!!!!!`.slice(0, 32);
  }
  throw new Error("SESSION_SECRET must be at least 32 characters in production (required by iron-session).");
}

export function getSessionOptions(): SessionOptions {
  return {
    cookieName: "wedding.sid",
    password: sessionPassword(),
    cookieOptions: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };
}

export async function getWeddingSession() {
  return getIronSession<WeddingSession>(await cookies(), getSessionOptions());
}
