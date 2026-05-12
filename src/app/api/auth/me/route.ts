import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { getUserById } from "@/lib/server/user-storage";

export async function GET() {
  try {
    await connectMongoose();
    const session = await getWeddingSession();
    const uid = session.userId;
    if (!uid) {
      return NextResponse.json({ success: true, data: { user: null } });
    }
    const user = await getUserById(uid);
    if (!user) {
      session.destroy();
      await session.save();
      return NextResponse.json({ success: true, data: { user: null } });
    }
    return NextResponse.json({ success: true, data: { user } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Failed to load session" }, { status: 500 });
  }
}
