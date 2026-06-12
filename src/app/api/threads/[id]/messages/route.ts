import { getSession } from "@/lib/auth";
import {
  addThreadMessage,
  getThreadById,
} from "@/lib/messaging-db";
import { notifyAdminOfLead } from "@/lib/notify";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const { id } = await params;
  const threadId = Number(id);
  if (!threadId) {
    return NextResponse.json({ error: "Invalid thread." }, { status: 400 });
  }

  const thread = await getThreadById(threadId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found." }, { status: 404 });
  }

  if (session.role !== "admin" && thread.user_id !== session.userId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json()) as { body?: string };
  const messageBody = body.body?.trim() ?? "";

  if (!messageBody || messageBody.length < 1) {
    return NextResponse.json(
      { error: "Message cannot be empty." },
      { status: 400 },
    );
  }

  const message = await addThreadMessage({
    threadId,
    senderId: session.userId,
    body: messageBody,
  });

  if (session.role === "user") {
    notifyAdminOfLead({
      name: thread.user_name ?? "Client",
      email: thread.user_email ?? "",
      message: `[${thread.subject}] ${messageBody}`,
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true, message });
}
