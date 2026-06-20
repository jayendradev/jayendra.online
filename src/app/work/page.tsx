import { AnimateIn } from "@/components/AnimateIn";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { WorkJsonLd } from "@/components/WorkJsonLd";
import { CtaButton } from "@/components/CtaButton";
import { projects } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";
import { primaryCta } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Work & Case Studies",
  description:
    "Production case studies: TheBriefWire news platform, AI Shopify SEO App, and private ADMSS portal. Shopify, Django, FastAPI, Next.js, PostgreSQL, and live VPS deployment.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Work", path: "/work" },
        ]}
      />
      <WorkJsonLd />
      <PageHeader
        title="Work"
        description="Problem → what I built → stack → result. Live links where public; private work labeled NDA."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        {projects.map((project, index) => (
          <AnimateIn key={project.slug} delay={index * 100}>
            <ProjectCard project={project} />
          </AnimateIn>
        ))}
      </div>
      <AnimateIn delay={200}>
        <div className="cta-glow mt-16 rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-lg font-medium text-foreground">
            Want something similar for your business?
          </p>
          <p className="mt-2 text-sm text-foreground-secondary">
            News site, Shopify app, or private portal—I&apos;ve shipped all three.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton href={primaryCta.href} label={primaryCta.label} />
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}
