"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const RESEND_COOLDOWN_SEC = 30;

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Props = {
  requireAdmin?: boolean;
  onLoggedIn: (user: AuthUser) => void;
  showRegisterLink?: boolean;
};

export function AuthLoginPanel({
  requireAdmin = false,
  onLoggedIn,
  showRegisterLink = true,
}: Props) {
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setResendCooldown((value) => value - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as { user?: AuthUser; error?: string };

    if (!res.ok || !data.user) {
      setError(data.error ?? "Login failed.");
      setLoading(false);
      return;
    }

    if (requireAdmin && data.user.role !== "admin") {
      setError("This login is for admin only.");
      setLoading(false);
      return;
    }

    onLoggedIn(data.user);
  }

  async function requestOtpCode() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { message?: string; error?: string };

    if (!res.ok) {
      setError(data.error ?? "Could not send code.");
      setLoading(false);
      return;
    }

    setOtpSent(true);
    setCode("");
    setInfo(data.message ?? "Login code sent.");
    setResendCooldown(RESEND_COOLDOWN_SEC);
    setLoading(false);
  }

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setInfo("");
    await requestOtpCode();
  }

  async function resendOtp() {
    if (resendCooldown > 0 || loading) return;
    setInfo("");
    await requestOtpCode();
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = (await res.json()) as { user?: AuthUser; error?: string };

    if (!res.ok || !data.user) {
      setError(data.error ?? "Invalid code.");
      setLoading(false);
      return;
    }

    if (requireAdmin && data.user.role !== "admin") {
      setError("This login is for admin only.");
      await fetch("/api/auth/logout", { method: "POST" });
      setLoading(false);
      return;
    }

    onLoggedIn(data.user);
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div className="flex rounded-lg border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setError("");
            setInfo("");
          }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "password"
              ? "bg-accent text-accent-foreground"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("otp");
            setError("");
            setInfo("");
          }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "otp"
              ? "bg-accent text-accent-foreground"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          Email code
        </button>
      </div>

      <p className="text-xs text-muted">
        Logged in for 6 hours, then you sign in again.
      </p>

      {mode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground-secondary">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground-secondary">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in with password"}
          </button>
        </form>
      ) : (
        <form onSubmit={otpSent ? verifyOtp : requestOtp} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground-secondary">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
            />
          </label>
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
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : otpSent
                ? "Verify code & log in"
                : "Send login code"}
          </button>
          {otpSent ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={resendOtp}
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
                Use a different email
              </button>
            </div>
          ) : null}
        </form>
      )}

      {showRegisterLink ? (
        <p className="text-center text-sm text-foreground-secondary">
          No account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      ) : null}
    </div>
  );
}
