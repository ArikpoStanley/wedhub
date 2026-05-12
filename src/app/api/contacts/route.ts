import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireSiteOwnerJson } from "@/lib/server/route-auth";
import { resolveSiteIdFromSearchAndBody, listSiteIdFromSearch, isDuplicateKeyError } from "@/lib/server/site-route-helpers";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { createContactSchema } from "@shared/wedding-schema";

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const body = (await req.json()) as Record<string, unknown>;
    const validatedData = createContactSchema.parse(body);
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
    const existingContact = await weddingStorage.getContactByEmail(validatedData.email, siteId);
    if (existingContact) {
      return NextResponse.json(
        { success: false, message: "Contact already exists for this email address on this site" },
        { status: 400 },
      );
    }
    const { siteId: _s, ...rest } = validatedData;
    const ownerOk = await requireSiteOwnerJson(session, siteId);
    if (ownerOk !== true) return ownerOk;
    const contact = await weddingStorage.createContact({ ...rest, siteId });
    return NextResponse.json(
      { success: true, message: "Contact created successfully", data: contact },
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
        { success: false, message: "Contact already exists for this email address on this site" },
        { status: 400 },
      );
    }
    console.error("Error creating contact:", error);
    return NextResponse.json({ success: false, message: "Failed to create contact" }, { status: 500 });
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
    const contacts = await weddingStorage.getAllContacts(siteId);
    return NextResponse.json({
      success: true,
      message: "Contacts retrieved successfully",
      data: contacts,
      total: contacts.length,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch contacts" }, { status: 500 });
  }
}
