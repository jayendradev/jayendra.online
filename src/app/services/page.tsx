import { AnimateIn } from "@/components/AnimateIn";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { CtaButton } from "@/components/CtaButton";
import { services } from "@/lib/services";
import { createPageMetadata } from "@/lib/seo";
import { primaryCta } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Shopify app development, Django/Next.js web apps, REST APIs, VPS deployment, and automation for founders, store owners, and small businesses.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <PageHeader
        title="Services"
        description="Shopify, Django/Next.js, deployment, and automation — clear scope for store owners, founders, and small businesses."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, index) => (
          <AnimateIn key={service.title} delay={index * 80}>
            <ServiceCard service={service} />
          </AnimateIn>
        ))}
      </div>
      <AnimateIn delay={200}>
        <p className="mt-12 max-w-2xl text-sm text-foreground-secondary">
          Typical engagement: discovery call → fixed scope or milestone plan →
          weekly updates → handoff with docs and deploy access. Stack chosen for
          maintainability (Django, Next.js, PostgreSQL, Shopify APIs)—not hype.
        </p>
        <div className="mt-8">
          <CtaButton href={primaryCta.href} label={primaryCta.label} />
        </div>
      </AnimateIn>
    </div>
  );
}
