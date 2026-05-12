import { Types } from "mongoose";
import { weddingStorage } from "./wedding-storage";

export async function resolveSiteIdFromSearchAndBody(
  searchParams: URLSearchParams,
  body: Record<string, unknown> | null,
): Promise<string | null> {
  const bodySid = typeof body?.siteId === "string" ? body.siteId : undefined;
  const querySid = searchParams.get("siteId") ?? undefined;
  const siteSlug = searchParams.get("site") ?? undefined;
  for (const id of [bodySid, querySid]) {
    if (id && Types.ObjectId.isValid(id)) {
      const site = await weddingStorage.getSiteById(id);
      if (site) return site._id;
    }
  }
  if (siteSlug) {
    const site = await weddingStorage.getSiteBySlug(siteSlug);
    if (site) return site._id;
  }
  return null;
}

export async function listSiteIdFromSearch(searchParams: URLSearchParams): Promise<string | null> {
  const q = searchParams.get("siteId") ?? undefined;
  if (q && Types.ObjectId.isValid(q)) {
    const site = await weddingStorage.getSiteById(q);
    if (site) return site._id;
  }
  const slug = searchParams.get("slug") ?? undefined;
  if (slug) {
    const site = await weddingStorage.getSiteBySlug(slug);
    if (site) return site._id;
  }
  return null;
}

export function isDuplicateKeyError(err: unknown): boolean {
  return Boolean(
    err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000,
  );
}
