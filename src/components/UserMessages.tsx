"use client";

import { ChatConversation } from "@/components/ChatConversation";
import { ChatThreadList } from "@/components/ChatThreadList";
import { EmailVerifyGate } from "@/components/EmailVerifyGate";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Thread = {
  id: number;
  subject: string;
  status: string;
  updated_at: string;
  last_message?: string;
};

type ThreadMessage = {
  id: number;
  body: string;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
};

export function UserMessages() {
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [reply, setReply] = useState("");
  const [subject, setSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      const me = (await meRes.json()) as { user: User | null };
      if (me.user?.role === "user") {
        setUser(me.user);
        await refreshThreads();
      }
      setLoading(false);
    }
    load();
  }, []);

  async function refreshThreads() {
    const res = await fetch("/api/threads");
    const data = (await res.json()) as { threads?: Thread[] };
    if (data.threads) setThreads(data.threads);
  }

  async function handleVerified(loggedInUser: User) {
    setUser(loggedInUser);
    setShowNew(true);
    await refreshThreads();
  }

  async function openThread(id: number) {
    setActiveId(id);
    setShowNew(false);
    setError("");
    const res = await fetch(`/api/threads/${id}`);
    const data = (await res.json()) as { messages?: ThreadMessage[] };
    if (data.messages) setMessages(data.messages);
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !reply.trim()) return;
    setError("");
    const res = await fetch(`/api/threads/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Could not send.");
      return;
    }
    setReply("");
    await openThread(activeId);
    await refreshThreads();
  }

  async function createThread(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body: newBody }),
    });
    const data = (await res.json()) as { thread?: Thread; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Could not create message.");
      return;
    }
    setSubject("");
    setNewBody("");
    setShowNew(false);
    await refreshThreads();
    if (data.thread) await openThread(data.thread.id);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setThreads([]);
    setActiveId(null);
    setMessages([]);
    setShowNew(false);
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!user) {
    return <EmailVerifyGate onVerified={handleVerified} />;
  }

  const activeThread = threads.find((t) => t.id === activeId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm text-muted">
          {user.name} · {user.email}
        </p>
        <button
          type="button"
          onClick={logout}
          className="shrink-0 text-sm text-muted hover:text-foreground"
        >
          Log out
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grid lg:grid-cols-[minmax(0,280px)_1fr]">
          <aside className="border-b border-border p-3 lg:border-r lg:border-b-0">
            <button
              type="button"
              onClick={() => {
                setShowNew(true);
                setActiveId(null);
                setMessages([]);
                setError("");
              }}
              className="mb-3 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground"
            >
              New message
            </button>
            <ChatThreadList
              threads={threads.map((t) => ({
                id: t.id,
                subject: t.subject,
                last_message: t.last_message,
                updated_at: t.updated_at,
              }))}
              activeId={activeId}
              onSelect={openThread}
            />
          </aside>

          <div className="min-h-[min(70vh,640px)] p-3 sm:p-4">
            {showNew ? (
              <form
                onSubmit={createThread}
                className="flex h-full flex-col rounded-2xl border border-border bg-background/40 p-4 sm:p-5"
              >
                <h2 className="font-semibold text-foreground">New message</h2>
                <p className="mt-1 text-xs text-muted">{site.replyTime}</p>
                <label className="mt-4 block">
                  <span className="text-xs font-medium text-muted">Subject</span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    minLength={3}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </label>
                <label className="mt-3 block flex-1">
                  <span className="text-xs font-medium text-muted">Message</span>
                  <textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    required
                    minLength={10}
                    rows={6}
                    className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </label>
                {error ? (
                  <p className="mt-3 text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground sm:w-auto"
                >
                  Send message
                </button>
              </form>
            ) : activeId && activeThread ? (
              <ChatConversation
                title={activeThread.subject}
                subtitle={`Chat with Jayendra · ${site.replyTime}`}
                messages={messages}
                viewerRole="user"
                otherPartyName="Jayendra"
                reply={reply}
                onReplyChange={setReply}
                onSendReply={sendReply}
                error={error}
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
                <div>
                  <p className="text-sm text-foreground-secondary">
                    Pick a conversation or start a new message.
                  </p>
                  <p className="mt-2 text-xs text-muted">{site.replyTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
