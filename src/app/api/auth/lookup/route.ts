import { findUserByEmail } from "@/lib/messaging-db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim() ?? "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ found: false });
  }

  const user = await findUserByEmail(email);
  if (!user || user.role !== "user") {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    name: user.name,
    email: user.email,
    usedAt: user.created_at,
  });
}
