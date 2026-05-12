import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireAuthJson } from "@/lib/server/route-auth";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { createSiteSchema } from "@shared/site-schema";
import { isDuplicateKeyError } from "@/lib/server/site-route-helpers";

export async function GET() {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const uid = requireAuthJson(session);
    if (uid instanceof NextResponse) return uid;
    const sites = await weddingStorage.listSitesForOwner(uid);
    return NextResponse.json({ success: true, message: "Sites retrieved", data: sites });
  } catch (error) {
    console.error("Error listing sites:", error);
    return NextResponse.json({ success: false, message: "Failed to list sites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const uid = requireAuthJson(session);
    if (uid instanceof NextResponse) return uid;
    const validated = createSiteSchema.parse(await req.json());
    const site = await weddingStorage.createSite({ ...validated, ownerUserId: uid });
    return NextResponse.json(
      { success: true, message: "Site created", data: site },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data", errors: error.errors },
        { status: 400 },
      );
    }
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ success: false, message: "Slug already in use" }, { status: 409 });
    }
    console.error("Error creating site:", error);
    return NextResponse.json({ success: false, message: "Failed to create site" }, { status: 500 });
  }
}
