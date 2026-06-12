import Link from "next/link";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">You&apos;re offline</h1>
      <p className="mt-4 text-muted">
        Cached pages may still work. Reconnect to browse the full site or send a
        message from {site.email}.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
