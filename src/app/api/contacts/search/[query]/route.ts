import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireSiteOwnerJson } from "@/lib/server/route-auth";
import { listSiteIdFromSearch } from "@/lib/server/site-route-helpers";
import { weddingStorage } from "@/lib/server/wedding-storage";

type Params = { params: Promise<{ query: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { query: rawQuery } = await params;
    const query = decodeURIComponent(rawQuery).toLowerCase().trim();
    if (!query) {
      return NextResponse.json({ success: false, message: "Search query is required" }, { status: 400 });
    }
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
    const contacts = await weddingStorage.searchContacts(siteId, query);
    return NextResponse.json({
      success: true,
      message: `Found ${contacts.length} matching contacts`,
      data: contacts,
      total: contacts.length,
    });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return NextResponse.json({ success: false, message: "Failed to search contacts" }, { status: 500 });
  }
}
