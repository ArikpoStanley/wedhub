import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { createRSVPSchema } from "@shared/wedding-schema";
import { isDuplicateKeyError } from "@/lib/server/site-route-helpers";

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const validatedData = createRSVPSchema.parse(await req.json());
    const siteId = validatedData.siteId;
    const existingRSVP = await weddingStorage.getRSVPByEmail(validatedData.email, siteId);
    if (existingRSVP) {
      return NextResponse.json(
        { success: false, message: "RSVP already exists for this email address on this site" },
        { status: 400 },
      );
    }
    const { siteId: _drop, ...rest } = validatedData;
    const rsvp = await weddingStorage.createRSVP({ ...rest, siteId });
    return NextResponse.json(
      { success: true, message: "RSVP submitted successfully", data: rsvp },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data provided", errors: error.errors },
        { status: 400 },
      );
    }
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { success: false, message: "RSVP already exists for this email address on this site" },
        { status: 400 },
      );
    }
    console.error("Error creating RSVP:", error);
    return NextResponse.json({ success: false, message: "Failed to submit RSVP" }, { status: 500 });
  }
}
