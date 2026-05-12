import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireSiteOwnerJson } from "@/lib/server/route-auth";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { createRSVPSchema } from "@shared/wedding-schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { id } = await params;
    const rsvp = await weddingStorage.getRSVPById(id);
    if (!rsvp) {
      return NextResponse.json({ success: false, message: "RSVP not found" }, { status: 404 });
    }
    const rsvpSiteId = rsvp.siteId;
    if (!rsvpSiteId) {
      return NextResponse.json({ success: false, message: "Invalid RSVP record" }, { status: 400 });
    }
    const ok = await requireSiteOwnerJson(session, rsvpSiteId);
    if (ok !== true) return ok;
    return NextResponse.json({
      success: true,
      message: "RSVP retrieved successfully",
      data: rsvp,
    });
  } catch (error) {
    console.error("Error fetching RSVP:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch RSVP" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { id } = await params;
    const existing = await weddingStorage.getRSVPById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "RSVP not found" }, { status: 404 });
    }
    const existingSiteId = existing.siteId;
    if (!existingSiteId) {
      return NextResponse.json({ success: false, message: "Invalid RSVP record" }, { status: 400 });
    }
    const ownerOk = await requireSiteOwnerJson(session, existingSiteId);
    if (ownerOk !== true) return ownerOk;
    const updates = createRSVPSchema.partial().parse(await req.json());
    const rsvp = await weddingStorage.updateRSVP(id, updates);
    if (!rsvp) {
      return NextResponse.json({ success: false, message: "RSVP not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "RSVP updated successfully",
      data: rsvp,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data provided", errors: error.errors },
        { status: 400 },
      );
    }
    console.error("Error updating RSVP:", error);
    return NextResponse.json({ success: false, message: "Failed to update RSVP" }, { status: 500 });
  }
}
