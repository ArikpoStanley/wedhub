import { NextResponse } from "next/server";
import { getWeddingSession } from "@/lib/session";

export async function POST() {
  try {
    const session = await getWeddingSession();
    session.destroy();
    await session.save();
    return NextResponse.json({ success: true, message: "Signed out" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Could not sign out" }, { status: 500 });
  }
}
