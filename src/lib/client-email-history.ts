export type EmailHistoryEntry = {
  email: string;
  name: string;
  usedAt: string;
};

const STORAGE_KEY = "jayendra_email_history";
const MAX_ENTRIES = 12;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function readEmailHistory(): EmailHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as EmailHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry) =>
          entry &&
          typeof entry.email === "string" &&
          typeof entry.name === "string" &&
          typeof entry.usedAt === "string",
      )
      .sort(
        (a, b) =>
          new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime(),
      );
  } catch {
    return [];
  }
}

export function saveEmailHistory(entry: EmailHistoryEntry) {
  if (typeof window === "undefined") return;
  const email = normalizeEmail(entry.email);
  if (!email || !entry.name.trim()) return;

  const next: EmailHistoryEntry = {
    email,
    name: entry.name.trim(),
    usedAt: entry.usedAt || new Date().toISOString(),
  };

  const existing = readEmailHistory().filter(
    (item) => normalizeEmail(item.email) !== email,
  );
  const merged = [next, ...existing].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function filterEmailHistory(
  history: EmailHistoryEntry[],
  query: string,
) {
  const q = normalizeEmail(query);
  if (!q) return history;
  return history.filter((entry) => entry.email.includes(q));
}

export function formatHistoryDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
