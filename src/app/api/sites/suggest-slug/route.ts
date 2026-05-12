import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireAuthJson } from "@/lib/server/route-auth";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { buildUniqueSlugCandidates } from "@/lib/server/slug-utils";

export async function GET(req: NextRequest) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const uid = requireAuthJson(session);
    if (uid instanceof NextResponse) return uid;

    const { searchParams } = new URL(req.url);
    const partnerOne = String(searchParams.get("partnerOne") ?? "").trim();
    const partnerTwo = String(searchParams.get("partnerTwo") ?? "").trim();
    if (!partnerOne || !partnerTwo) {
      return NextResponse.json(
        { success: false, message: "partnerOne and partnerTwo query params are required" },
        { status: 400 },
      );
    }
    const candidates = buildUniqueSlugCandidates(partnerOne, partnerTwo);
    let suggested = candidates[0] ?? "wedding";
    const taken: string[] = [];
    for (const c of candidates) {
      const existing = await weddingStorage.getSiteBySlug(c);
      if (!existing) {
        suggested = c;
        return NextResponse.json({
          success: true,
          data: { suggested, candidates, taken },
        });
      }
      taken.push(c);
    }
    suggested = `${candidates[0]}-${Math.random().toString(36).slice(2, 6)}`;
    return NextResponse.json({
      success: true,
      data: { suggested, candidates: [...candidates, suggested], taken },
    });
  } catch (error) {
    console.error("Error suggesting slug:", error);
    return NextResponse.json({ success: false, message: "Failed to suggest slug" }, { status: 500 });
  }
}
