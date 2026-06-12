"use client";

import {
  filterEmailHistory,
  formatHistoryDate,
  readEmailHistory,
  saveEmailHistory,
  type EmailHistoryEntry,
} from "@/lib/client-email-history";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Props = {
  onVerified: (user: User) => void;
};

const RESEND_COOLDOWN_SEC = 30;

export function EmailVerifyGate({ onVerified }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [needsName, setNeedsName] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [history, setHistory] = useState<EmailHistoryEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const emailWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(readEmailHistory());
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setResendCooldown((value) => value - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emailWrapRef.current &&
        !emailWrapRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = filterEmailHistory(history, email);

  async function lookupNameForEmail(value: string) {
    const trimmed = value.trim();
    if (!trimmed || !trimmed.includes("@")) return;

    const local = history.find(
      (entry) => entry.email === trimmed.toLowerCase(),
    );
    if (local?.name) {
      setName(local.name);
      setNeedsName(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/auth/lookup?email=${encodeURIComponent(trimmed)}`,
      );
      const data = (await res.json()) as {
        found?: boolean;
        name?: string;
      };
      if (data.found && data.name) {
        setName(data.name);
        setNeedsName(false);
      }
    } catch {
      // ignore lookup errors
    }
  }

  function pickEmail(entry: EmailHistoryEntry) {
    setEmail(entry.email);
    setName(entry.name);
    setNeedsName(false);
    setShowSuggestions(false);
    setError("");
  }

  async function requestCode() {
    setLoading(true);
    setError("");
    setErrorCode("");
    setContactEmail("");

    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined }),
    });
    const data = (await res.json()) as {
      message?: string;
      error?: string;
      needsName?: boolean;
      code?: string;
      contactEmail?: string;
    };

    if (!res.ok) {
      if (data.needsName) setNeedsName(true);
      setError(data.error ?? "Could not send code.");
      setErrorCode(data.code ?? "");
      setContactEmail(data.contactEmail ?? "");
      setLoading(false);
      return;
    }

    setOtpSent(true);
    setNeedsName(false);
    setCode("");
    setInfo(data.message ?? "Code sent. Check your email.");
    setResendCooldown(RESEND_COOLDOWN_SEC);
    setLoading(false);
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setInfo("");
    await requestCode();
  }

  async function resendCode() {
    if (resendCooldown > 0 || loading) return;
    setInfo("");
    await requestCode();
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = (await res.json()) as { user?: User; error?: string };

    if (!res.ok || !data.user) {
      setError(data.error ?? "Invalid code.");
      setLoading(false);
      return;
    }

    const entry = {
      email: data.user.email,
      name: data.user.name,
      usedAt: new Date().toISOString(),
    };
    saveEmailHistory(entry);
    setHistory(readEmailHistory());
    onVerified(data.user);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">
        Verify your email
      </h2>
      <p className="mt-2 text-sm text-foreground-secondary">
        No password needed. We send a code to your email. Match the code, then
        you can send your message. Session lasts 6 hours.
      </p>

      <form
        onSubmit={otpSent ? verifyCode : sendCode}
        className="mt-6 space-y-4"
      >
        <label className="block">
          <span className="text-sm font-medium text-foreground-secondary">
            Email
          </span>
          <div ref={emailWrapRef} className="relative mt-1.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => {
                if (!otpSent && history.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                window.setTimeout(() => lookupNameForEmail(email), 150);
              }}
              required
              disabled={otpSent}
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent disabled:opacity-70"
            />
            {showSuggestions && !otpSent && suggestions.length > 0 ? (
              <ul
                className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-surface-elevated py-1 shadow-lg"
                role="listbox"
                aria-label="Previously used emails"
              >
                {suggestions.map((entry) => (
                  <li key={entry.email}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickEmail(entry)}
                      className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/10"
                      role="option"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-foreground">
                          {entry.email}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {entry.name}
                        </span>
                      </span>
                      <span className="shrink-0 text-[10px] text-muted">
                        {formatHistoryDate(entry.usedAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </label>

        {(needsName || !otpSent) && (
          <label className="block">
            <span className="text-sm font-medium text-foreground-secondary">
              Your name {needsName ? "(required)" : "(first time only)"}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={needsName}
              minLength={needsName ? 2 : undefined}
              autoComplete="name"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
              placeholder="Your name"
            />
          </label>
        )}

        {otpSent ? (
          <label className="block">
            <span className="text-sm font-medium text-foreground-secondary">
              6-digit code from email
            </span>
            <input
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono tracking-widest text-foreground outline-none focus:border-accent"
            />
          </label>
        ) : null}

        {info ? <p className="text-sm text-accent">{info}</p> : null}
        {error ? (
          <div className="space-y-2" role="alert">
            <p className="text-sm text-red-400">{error}</p>
            {errorCode === "delivery_limited" && contactEmail ? (
              <p className="text-sm text-foreground-secondary">
                <Link href="/contact" className="text-accent underline">
                  Contact page
                </Link>
                {" · "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-accent underline"
                >
                  {contactEmail}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : otpSent
              ? "Verify & continue"
              : "Send code to email"}
        </button>

        {otpSent ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={resendCode}
              disabled={loading || resendCooldown > 0}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface-elevated disabled:opacity-50"
            >
              {resendCooldown > 0
                ? `Resend code (${resendCooldown}s)`
                : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setCode("");
                setInfo("");
                setError("");
                setResendCooldown(0);
              }}
              className="w-full text-sm text-muted hover:text-foreground"
            >
              Change email
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
