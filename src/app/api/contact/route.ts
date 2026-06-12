import { saveContactMessage } from "@/lib/messaging-db";
import { notifyAdminOfLead, sendLeadAutoReply } from "@/lib/notify";
import { site } from "@/lib/site";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      company?: string;
      message?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const company = body.company?.trim();
    const message = body.message?.trim() ?? "";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 },
      );
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 },
      );
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: "Please share a bit more about your project (10+ characters)." },
        { status: 400 },
      );
    }

    const lead = { name, email, company, message };
    await saveContactMessage(lead);

    const [adminResult, autoReplyResult] = await Promise.all([
      notifyAdminOfLead(lead),
      sendLeadAutoReply(lead),
    ]);

    if (!adminResult.ok) {
      console.error("[contact] Admin notification failed:", adminResult.error);
    } else {
      console.info(`[contact] Admin notified via ${adminResult.provider}`);
    }

    if (!autoReplyResult.ok) {
      console.error("[contact] Auto-reply failed:", autoReplyResult.error);
    }

    return NextResponse.json({
      ok: true,
      message: `Thanks, ${name.split(" ")[0]}. I'll reply to ${email} — ${site.replyTime.toLowerCase()}.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Email me directly instead." },
      { status: 500 },
    );
  }
}
