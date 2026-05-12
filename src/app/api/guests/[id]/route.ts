import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireSiteOwnerJson } from "@/lib/server/route-auth";
import { weddingStorage } from "@/lib/server/wedding-storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { id } = await params;
    const guest = await weddingStorage.getGuestById(id);
    if (!guest) {
      return NextResponse.json({ success: false, message: "Guest not found" }, { status: 404 });
    }
    const guestSiteId = guest.siteId;
    if (!guestSiteId) {
      return NextResponse.json({ success: false, message: "Invalid guest record" }, { status: 400 });
    }
    const ok = await requireSiteOwnerJson(session, guestSiteId);
    if (ok !== true) return ok;
    return NextResponse.json({
      success: true,
      message: "Guest retrieved successfully",
      data: guest,
    });
  } catch (error) {
    console.error("Error fetching guest:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch guest" }, { status: 500 });
  }
}
