import {
  findOrCreateUserForOtp,
  generateOtpCode,
  saveLoginOtp,
} from "@/lib/messaging-db";
import { sendLoginOtpEmail } from "@/lib/notify";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; name?: string };
    const email = body.email?.trim() ?? "";
    const name = body.name?.trim() ?? "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 },
      );
    }

    let user;
    try {
      ({ user } = await findOrCreateUserForOtp(email, name));
    } catch (err) {
      if (err instanceof Error && err.message === "NEEDS_NAME") {
        return NextResponse.json(
          {
            needsName: true,
            error: "First time here? Enter your name, then send the code.",
          },
          { status: 400 },
        );
      }
      throw err;
    }

    const code = generateOtpCode();
    await saveLoginOtp(email, code);

    const sent = await sendLoginOtpEmail(user.email, code);
    if (!sent.ok) {
      console.error("[otp] Email failed:", sent.error);
      return NextResponse.json(
        {
          error:
            sent.error ??
            "Could not send login code. Fix SMTP settings in .env.local.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Code sent to ${user.email}. Enter it below to continue.`,
    });
  } catch (err) {
    console.error("[otp] Request failed:", err);
    const message =
      err instanceof Error ? err.message : "Could not send login code.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
