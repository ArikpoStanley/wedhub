import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { requireSiteOwnerJson } from "@/lib/server/route-auth";
import { weddingStorage } from "@/lib/server/wedding-storage";
import { createContactSchema } from "@shared/wedding-schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { id } = await params;
    const contact = await weddingStorage.getContactById(id);
    if (!contact) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }
    const contactSiteId = contact.siteId;
    if (!contactSiteId) {
      return NextResponse.json({ success: false, message: "Invalid contact record" }, { status: 400 });
    }
    const ok = await requireSiteOwnerJson(session, contactSiteId);
    if (ok !== true) return ok;
    return NextResponse.json({
      success: true,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch contact" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { id } = await params;
    const prev = await weddingStorage.getContactById(id);
    if (!prev) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }
    const prevContactSiteId = prev.siteId;
    if (!prevContactSiteId) {
      return NextResponse.json({ success: false, message: "Invalid contact record" }, { status: 400 });
    }
    const ownerOk = await requireSiteOwnerJson(session, prevContactSiteId);
    if (ownerOk !== true) return ownerOk;
    const updates = createContactSchema.partial().parse(await req.json());
    const contact = await weddingStorage.updateContact(id, updates);
    if (!contact) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data provided", errors: error.errors },
        { status: 400 },
      );
    }
    console.error("Error updating contact:", error);
    return NextResponse.json({ success: false, message: "Failed to update contact" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const { id } = await params;
    const prev = await weddingStorage.getContactById(id);
    if (!prev) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }
    const delContactSiteId = prev.siteId;
    if (!delContactSiteId) {
      return NextResponse.json({ success: false, message: "Invalid contact record" }, { status: 400 });
    }
    const ownerOk = await requireSiteOwnerJson(session, delContactSiteId);
    if (ownerOk !== true) return ownerOk;
    const success = await weddingStorage.deleteContact(id);
    if (!success) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ success: false, message: "Failed to delete contact" }, { status: 500 });
  }
}
