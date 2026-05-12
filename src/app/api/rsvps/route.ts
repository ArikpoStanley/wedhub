import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireSiteOwnerJson } from "@/lib/server/route-auth";
import { listSiteIdFromSearch } from "@/lib/server/site-route-helpers";
import { weddingStorage } from "@/lib/server/wedding-storage";

export async function GET(req: NextRequest) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { searchParams } = new URL(req.url);
    const siteId = await listSiteIdFromSearch(searchParams);
    if (!siteId) {
      return NextResponse.json(
        { success: false, message: "Provide siteId or slug as a query parameter" },
        { status: 400 },
      );
    }
    const ok = await requireSiteOwnerJson(session, siteId);
    if (ok !== true) return ok;
    const rsvps = await weddingStorage.getAllRSVPs(siteId);
    return NextResponse.json({
      success: true,
      message: "RSVPs retrieved successfully",
      data: rsvps,
      total: rsvps.length,
    });
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch RSVPs" }, { status: 500 });
  }
}
