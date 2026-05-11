import type { Request, Response } from "express";
import { weddingStorage } from "./wedding-storage";

export function getSessionUserId(req: Request): string | undefined {
  return req.session?.userId;
}

export function requireAuth(req: Request, res: Response): string | null {
  const id = getSessionUserId(req);
  if (!id) {
    res.status(401).json({ success: false, message: "Sign in to continue" });
    return null;
  }
  return id;
}

export async function requireSiteOwner(req: Request, res: Response, siteId: string): Promise<boolean> {
  const uid = requireAuth(req, res);
  if (!uid) return false;
  const ok = await weddingStorage.userOwnsSite(siteId, uid);
  if (!ok) {
    res.status(403).json({ success: false, message: "You do not have access to this site" });
    return false;
  }
  return true;
}
