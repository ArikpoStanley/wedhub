import { NextResponse } from "next/server";
import type { IronSession } from "iron-session";
import { weddingStorage } from "./wedding-storage";

type SessionData = { userId?: string };

export function getSessionUserId(session: IronSession<SessionData>): string | undefined {
  return session.userId;
}

export function requireAuthJson(session: IronSession<SessionData>): string | NextResponse {
  const id = session.userId;
  if (!id) {
    return NextResponse.json({ success: false, message: "Sign in to continue" }, { status: 401 });
  }
  return id;
}

export async function requireSiteOwnerJson(
  session: IronSession<SessionData>,
  siteId: string,
): Promise<true | NextResponse> {
  const uid = requireAuthJson(session);
  if (uid instanceof NextResponse) return uid;
  const ok = await weddingStorage.userOwnsSite(siteId, uid);
  if (!ok) {
    return NextResponse.json({ success: false, message: "You do not have access to this site" }, { status: 403 });
  }
  return true;
}
