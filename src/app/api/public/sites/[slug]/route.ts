import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { weddingStorage, toPublicSite } from "@/lib/server/wedding-storage";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const { slug } = await params;
    const site = await weddingStorage.getSiteBySlug(slug);
    if (!site) {
      return NextResponse.json({ success: false, message: "Site not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "Site loaded",
      data: toPublicSite(site),
    });
  } catch (error) {
    console.error("Error loading public site:", error);
    return NextResponse.json({ success: false, message: "Failed to load site" }, { status: 500 });
  }
}
