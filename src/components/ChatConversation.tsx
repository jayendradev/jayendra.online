"use client";

type ChatMessage = {
  id: number;
  body: string;
  created_at: string;
  sender_role?: string;
  sender_name?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  messages: ChatMessage[];
  viewerRole: "user" | "admin";
  otherPartyName?: string;
  reply: string;
  onReplyChange: (value: string) => void;
  onSendReply: (e: React.FormEvent) => void;
  error?: string;
  emptyLabel?: string;
};

function isOwnMessage(viewerRole: "user" | "admin", senderRole?: string) {
  if (viewerRole === "admin") return senderRole === "admin";
  return senderRole !== "admin";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ChatConversation({
  title,
  subtitle,
  messages,
  viewerRole,
  otherPartyName = "Jayendra",
  reply,
  onReplyChange,
  onSendReply,
  error,
  emptyLabel = "No messages yet.",
}: Props) {
  return (
    <div className="flex h-[min(70vh,640px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="shrink-0 border-b border-border px-4 py-3 sm:px-5">
        <h2 className="truncate font-semibold text-foreground">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto bg-background/40 px-3 py-4 sm:px-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">{emptyLabel}</p>
        ) : (
          messages.map((msg) => {
            const own = isOwnMessage(viewerRole, msg.sender_role);
            const label = own
              ? "You"
              : msg.sender_role === "admin"
                ? otherPartyName
                : (msg.sender_name ?? "Client");

            return (
              <div
                key={msg.id}
                className={`flex ${own ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] ${
                    own ? "items-end" : "items-start"
                  } flex flex-col`}
                >
                  {!own ? (
                    <span className="mb-1 px-1 text-[11px] font-medium text-muted">
                      {label}
                    </span>
                  ) : null}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      own
                        ? "rounded-br-md bg-accent text-accent-foreground"
                        : "rounded-bl-md border border-border bg-surface-elevated text-foreground-secondary"
                    }`}
                  >
                    {msg.body}
                  </div>
                  <span
                    className={`mt-1 px-1 text-[10px] text-muted ${
                      own ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={onSendReply}
        className="shrink-0 border-t border-border bg-surface p-3 sm:p-4"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={reply}
            onChange={(e) => onReplyChange(e.target.value)}
            rows={1}
            required
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button
            type="submit"
            disabled={!reply.trim()}
            className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-40"
          >
            Send
          </button>
        </div>
        {error ? (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
