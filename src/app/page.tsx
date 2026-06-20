import { AnimateIn } from "@/components/AnimateIn";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { Avatar } from "@/components/Avatar";
import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { HeroBackground } from "@/components/HeroBackground";
import { HeroTrust } from "@/components/HeroTrust";
import { createPageMetadata, siteDescription } from "@/lib/seo";
import { serviceOfferings } from "@/lib/service-offerings";
import { site, primaryCta } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: `${site.name} | ${site.title}`,
  description: siteDescription,
  path: "",
});

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <HeroBackground />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:items-start">
            <div>
              <div className="animate-hero-in">
                <Avatar size="md" />
              </div>
              <p className="animate-hero-in-delay-1 mt-4 text-sm font-medium text-accent">
                {site.role}
              </p>
              <h1 className="animate-hero-in-delay-2 mt-3 max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl sm:leading-tight lg:text-4xl">
                {site.name} — {site.seoHeadline}
              </h1>
              <div className="animate-hero-in-delay-2 mt-3">
                <AvailabilityBadge />
              </div>
              <h2 className="animate-hero-in-delay-3 mt-5 max-w-2xl text-lg font-medium leading-relaxed text-foreground-secondary sm:text-xl">
                {site.tagline}
              </h2>
              <p className="animate-hero-in-delay-3 mt-4 max-w-2xl text-xs leading-relaxed text-foreground-secondary sm:text-sm">
                {site.subtagline}
              </p>
              <p className="animate-hero-in-delay-3 mt-3 max-w-xl text-sm text-foreground-secondary">
                {site.heroDetail}
              </p>
              <div className="animate-hero-in-delay-4 mt-8">
                <CtaButton href={primaryCta.href} label={primaryCta.label} />
              </div>
              <dl className="animate-hero-in-delay-4 mt-12 text-sm">
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="mt-1 font-medium">{site.location}</dd>
                </div>
              </dl>
            </div>
            <div className="animate-hero-in-delay-2 hidden lg:block">
              <HeroTrust />
            </div>
          </div>
          <div className="animate-hero-in-delay-3 mt-8 lg:hidden">
            <HeroTrust />
          </div>
        </div>
      </section>

      <section
        className="border-t border-border/60 bg-surface/40"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <AnimateIn>
            <h2
              id="services-heading"
              className="text-2xl font-semibold text-foreground"
            >
              Services
            </h2>
          </AnimateIn>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceOfferings.map((item, index) => (
              <AnimateIn key={item.title} delay={index * 80}>
                <article className="card-hover h-full rounded-xl border border-border bg-background p-5 hover:border-accent/30">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-foreground-secondary">
                    {item.description}
                  </p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <AnimateIn>
        <CtaBand />
      </AnimateIn>
    </div>
  );
}
