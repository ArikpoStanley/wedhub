import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { loginSchema } from "@shared/auth-schema";
import { verifyUserCredentials } from "@/lib/server/user-storage";

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const body = await req.json();
    const parsed = loginSchema.parse(body);
    const user = await verifyUserCredentials(parsed.email, parsed.password);
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }
    const session = await getWeddingSession();
    session.userId = user.id;
    await session.save();
    return NextResponse.json({ success: true, message: "Signed in", data: { user } });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: e.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ success: false, message: "Sign in failed" }, { status: 500 });
  }
}
