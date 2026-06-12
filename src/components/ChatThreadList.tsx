"use client";

type ThreadItem = {
  id: number;
  subject: string;
  last_message?: string;
  updated_at?: string;
  meta?: string;
};

type Props = {
  threads: ThreadItem[];
  activeId: number | null;
  onSelect: (id: number) => void;
  emptyLabel?: string;
};

function formatPreview(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ChatThreadList({
  threads,
  activeId,
  onSelect,
  emptyLabel = "No conversations yet.",
}: Props) {
  if (threads.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {threads.map((thread) => {
        const active = activeId === thread.id;
        return (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => onSelect(thread.id)}
              className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
                active
                  ? "bg-accent/10 ring-1 ring-accent/30"
                  : "hover:bg-surface-elevated"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-medium text-foreground">
                  {thread.subject}
                </p>
                {thread.updated_at ? (
                  <span className="shrink-0 text-[10px] text-muted">
                    {formatPreview(thread.updated_at)}
                  </span>
                ) : null}
              </div>
              {thread.meta ? (
                <p className="mt-0.5 truncate text-xs text-accent">{thread.meta}</p>
              ) : null}
              {thread.last_message ? (
                <p className="mt-1 line-clamp-1 text-xs text-muted">
                  {thread.last_message}
                </p>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
