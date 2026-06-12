import { getSession } from "@/lib/auth";
import {
  getThreadById,
  listThreadMessages,
} from "@/lib/messaging-db";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
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

  const messages = await listThreadMessages(threadId);
  return NextResponse.json({ thread, messages });
}
