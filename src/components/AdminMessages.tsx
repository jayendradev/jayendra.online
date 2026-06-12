"use client";

import { AuthLoginPanel } from "@/components/AuthLoginPanel";
import { ChatConversation } from "@/components/ChatConversation";
import { ChatThreadList } from "@/components/ChatThreadList";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Thread = {
  id: number;
  subject: string;
  user_name?: string;
  user_email?: string;
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

export function AdminMessages() {
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    const meRes = await fetch("/api/auth/me");
    const me = (await meRes.json()) as { user: User | null };
    if (me.user?.role === "admin") {
      setUser(me.user);
      await refreshThreads();
    }
    setLoading(false);
  }

  async function refreshThreads() {
    const res = await fetch("/api/threads");
    const data = (await res.json()) as { threads?: Thread[] };
    if (data.threads) setThreads(data.threads);
  }

  async function openThread(id: number) {
    setActiveId(id);
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
      setError(data.error ?? "Could not send reply.");
      return;
    }
    setReply("");
    await openThread(activeId);
    await refreshThreads();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setThreads([]);
    setActiveId(null);
    setMessages([]);
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Admin login</h2>
        <AuthLoginPanel
          requireAdmin
          showRegisterLink={false}
          onLoggedIn={async (loggedInUser) => {
            setUser(loggedInUser);
            await refreshThreads();
          }}
        />
      </div>
    );
  }

  const activeThread = threads.find((t) => t.id === activeId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Admin · <span className="text-foreground">{user.email}</span>
        </p>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-muted hover:text-foreground"
        >
          Log out
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grid lg:grid-cols-[minmax(0,300px)_1fr]">
          <aside className="border-b border-border p-3 lg:border-r lg:border-b-0">
            <p className="mb-3 px-1 text-xs font-medium tracking-wide text-muted uppercase">
              Inbox
            </p>
            <ChatThreadList
              threads={threads.map((t) => ({
                id: t.id,
                subject: t.subject,
                last_message: t.last_message,
                updated_at: t.updated_at,
                meta:
                  t.user_name && t.user_email
                    ? `${t.user_name} · ${t.user_email}`
                    : undefined,
              }))}
              activeId={activeId}
              onSelect={openThread}
              emptyLabel="No client messages yet."
            />
          </aside>

          <div className="min-h-[min(70vh,640px)] p-3 sm:p-4">
            {activeId && activeThread ? (
              <ChatConversation
                title={activeThread.subject}
                subtitle={`${activeThread.user_name ?? "Client"} · ${activeThread.user_email ?? ""}`}
                messages={messages}
                viewerRole="admin"
                reply={reply}
                onReplyChange={setReply}
                onSendReply={sendReply}
                error={error}
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
                <p className="text-sm text-foreground-secondary">
                  Select a conversation to reply.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
