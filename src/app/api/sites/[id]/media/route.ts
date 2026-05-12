import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { getSessionUserId, requireSiteOwnerJson } from "@/lib/server/route-auth";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { ensureCloudinaryConfigured, uploadImageBuffer } from "@/lib/server/cloudinary-upload";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    if (!getSessionUserId(session)) {
      return NextResponse.json({ success: false, message: "Sign in to continue" }, { status: 401 });
    }
    const { id: siteId } = await params;
    const ownerOk = await requireSiteOwnerJson(session, siteId);
    if (ownerOk !== true) return ownerOk;
    if (!ensureCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment.",
        },
        { status: 503 },
      );
    }
    const formData = await req.formData();
    const files = formData.getAll("images").filter((v): v is File => v instanceof File);
    if (!files.length) {
      return NextResponse.json(
        {
          success: false,
          message: "No image files received. Use the field name “images” in the form.",
        },
        { status: 400 },
      );
    }
    const site = await weddingStorage.getSiteById(siteId);
    if (!site) {
      return NextResponse.json({ success: false, message: "Site not found" }, { status: 404 });
    }
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind") === "hero" ? "hero" : "gallery";
    const subfolder = `sites/${site.slug}/${kind}`;
    const urls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      urls.push(await uploadImageBuffer(buffer, subfolder));
    }
    return NextResponse.json({ success: true, message: "Uploaded", data: { urls } });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
