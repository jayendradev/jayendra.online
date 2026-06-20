import { AttachmentEmailNote } from "@/components/AttachmentEmailNote";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CtaButton } from "@/components/CtaButton";
import { PageHeader } from "@/components/PageHeader";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: `Hire ${site.name} for Shopify apps, Django, FastAPI, Golang, and Next.js projects. VPS deployment, bug fixes, and maintenance. ${site.replyTime}. Based in ${site.location}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <PageHeader
        title="Contact"
        description="Enter your email, verify with a code, and send your message — or email directly."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Send a message</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            No account password needed. We email you a code — verify it, then write
            your project message. Jayendra replies here —{" "}
            {site.replyTime.toLowerCase()}.
          </p>
          <div className="mt-6">
            <CtaButton href="/messages" label="Send a message" />
          </div>
          <AttachmentEmailNote className="mt-4 border-t border-border pt-4" />
        </div>

        <aside className="space-y-8 text-sm">
          <div>
            <h2 className="font-semibold text-foreground">Email</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 inline-block text-accent hover:underline"
            >
              {site.email}
            </a>
            <p className="mt-2 text-foreground-secondary">{site.replyTime}</p>
            <p className="mt-2 text-foreground-secondary">
              Attach briefs, screenshots, or designs directly in your email.
            </p>
          </div>

          {site.calendlyUrl ? (
            <div>
              <h2 className="font-semibold text-foreground">Book a call</h2>
              <a
                href={site.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-accent hover:underline"
              >
                15-minute intro call →
              </a>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
