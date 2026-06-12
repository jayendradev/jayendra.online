import {
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import {
  findUserByEmail,
  verifyLoginOtp,
} from "@/lib/messaging-db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    const email = body.email?.trim() ?? "";
    const code = body.code?.trim() ?? "";

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and login code are required." },
        { status: 400 },
      );
    }

    const valid = await verifyLoginOtp(email, code);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired login code." },
        { status: 401 },
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 },
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  } catch {
    return NextResponse.json(
      { error: "OTP login failed." },
      { status: 500 },
    );
  }
}
