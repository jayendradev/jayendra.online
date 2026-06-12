"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const searchParams = useSearchParams();
  const isWebsiteCheck = searchParams.get("topic") === "website-check";
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          message: data.get("message"),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; error?: string };

      if (!res.ok) {
        setError(json.error ?? "Could not send. Try email instead.");
        setState("error");
        return;
      }

      setSuccessMessage(json.message ?? "Message sent. I'll be in touch soon.");
      setState("success");
      form.reset();
    } catch {
      setError("Network error. Email me directly.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
        <p className="text-lg font-medium text-foreground">{successMessage}</p>
        <p className="mt-2 text-sm text-muted">
          Or email{" "}
          <a href={`mailto:${site.email}`} className="text-accent hover:underline">
            {site.email}
          </a>
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm text-muted hover:text-foreground"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground-secondary">Name</span>
          <input
            name="name"
            required
            minLength={2}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground-secondary">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-foreground-secondary">Company (optional)</span>
        <input
          name="company"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          placeholder="Your company or project"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground-secondary">
          {isWebsiteCheck ? "Your website or store URL" : "Project details"}
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          placeholder={
            isWebsiteCheck
              ? "Paste your website or Shopify store URL. Mention what feels broken or slow — I'll suggest the first practical fix."
              : "What are you building? Timeline, budget range, links…"
          }
        />
      </label>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
