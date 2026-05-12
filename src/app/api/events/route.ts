import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireSiteOwnerJson } from "@/lib/server/route-auth";
import { resolveSiteIdFromSearchAndBody, listSiteIdFromSearch } from "@/lib/server/site-route-helpers";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { createWeddingEventSchema } from "@shared/wedding-schema";

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const body = (await req.json()) as Record<string, unknown>;
    const validatedData = createWeddingEventSchema.parse(body);
    const { searchParams } = new URL(req.url);
    const siteId = validatedData.siteId ?? (await resolveSiteIdFromSearchAndBody(searchParams, body));
    if (!siteId) {
      return NextResponse.json(
        {
          success: false,
          message: "siteId is required in the body, or pass site / siteId as query parameters",
        },
        { status: 400 },
      );
    }
    const { siteId: _s, ...rest } = validatedData;
    const ownerOk = await requireSiteOwnerJson(session, siteId);
    if (ownerOk !== true) return ownerOk;
    const event = await weddingStorage.createWeddingEvent({ ...rest, siteId });
    return NextResponse.json(
      { success: true, message: "Wedding event created successfully", data: event },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data provided", errors: error.errors },
        { status: 400 },
      );
    }
    console.error("Error creating wedding event:", error);
    return NextResponse.json({ success: false, message: "Failed to create wedding event" }, { status: 500 });
  }
}

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
    const events = await weddingStorage.getAllWeddingEvents(siteId);
    return NextResponse.json({
      success: true,
      message: "Wedding events retrieved successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching wedding events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch wedding events" },
      { status: 500 },
    );
  }
}
