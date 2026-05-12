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
    const event = await weddingStorage.getWeddingEventById(id);
    if (!event) {
      return NextResponse.json({ success: false, message: "Wedding event not found" }, { status: 404 });
    }
    const eventSiteId = event.siteId;
    if (!eventSiteId) {
      return NextResponse.json({ success: false, message: "Invalid event record" }, { status: 400 });
    }
    const ok = await requireSiteOwnerJson(session, eventSiteId);
    if (ok !== true) return ok;
    return NextResponse.json({
      success: true,
      message: "Wedding event retrieved successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error fetching wedding event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch wedding event" },
      { status: 500 },
    );
  }
}
