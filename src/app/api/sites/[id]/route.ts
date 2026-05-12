import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireAuthJson, requireSiteOwnerJson } from "@/lib/server/route-auth";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { updateSiteSchema } from "@shared/site-schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const uid = requireAuthJson(session);
    if (uid instanceof NextResponse) return uid;
    const { id } = await params;
    const site = await weddingStorage.getSiteById(id);
    if (!site) {
      return NextResponse.json({ success: false, message: "Site not found" }, { status: 404 });
    }
    if (site.ownerUserId !== uid) {
      return NextResponse.json({ success: false, message: "You do not have access to this site" }, { status: 403 });
    }
    return NextResponse.json({ success: true, message: "Site retrieved", data: site });
  } catch (error) {
    console.error("Error fetching site:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch site" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { id } = await params;
    const ok = await requireSiteOwnerJson(session, id);
    if (ok !== true) return ok;
    const updates = updateSiteSchema.parse(await req.json());
    const site = await weddingStorage.updateSite(id, updates);
    if (!site) {
      return NextResponse.json({ success: false, message: "Site not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Site updated", data: site });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data", errors: error.errors },
        { status: 400 },
      );
    }
    console.error("Error updating site:", error);
    return NextResponse.json({ success: false, message: "Failed to update site" }, { status: 500 });
  }
}
