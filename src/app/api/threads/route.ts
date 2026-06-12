import { getSession } from "@/lib/auth";
import {
  createThread,
  findUserById,
  listAllThreads,
  listThreadsForUser,
} from "@/lib/messaging-db";
import { notifyAdminOfLead } from "@/lib/notify";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const threads =
    session.role === "admin"
      ? await listAllThreads()
      : await listThreadsForUser(session.userId);

  return NextResponse.json({ threads });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "user") {
    return NextResponse.json({ error: "Login as a client to send a message." }, { status: 401 });
  }

  const body = (await request.json()) as { subject?: string; body?: string };
  const subject = body.subject?.trim() ?? "";
  const messageBody = body.body?.trim() ?? "";

  if (!subject || subject.length < 3) {
    return NextResponse.json(
      { error: "Subject must be at least 3 characters." },
      { status: 400 },
    );
  }
  if (!messageBody || messageBody.length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters." },
      { status: 400 },
    );
  }

  const result = await createThread({
    userId: session.userId,
    subject,
    body: messageBody,
  });

  const user = await findUserById(session.userId);
  if (user) {
    notifyAdminOfLead({
      name: user.name,
      email: user.email,
      message: `[${subject}] ${messageBody}`,
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true, ...result });
}
