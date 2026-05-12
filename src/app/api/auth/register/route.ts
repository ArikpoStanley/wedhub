import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoose } from "@/lib/mongodb";
import { getWeddingSession } from "@/lib/session";
import { registerSchema } from "@shared/auth-schema";
import { createUser } from "@/lib/server/user-storage";

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const body = registerSchema.parse(await req.json());
    const out = await createUser(body.email, body.password);
    if ("error" in out) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 },
      );
    }
    const session = await getWeddingSession();
    session.userId = out.id;
    await session.save();
    return NextResponse.json(
      { success: true, message: "Account created", data: { user: out } },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: e.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
