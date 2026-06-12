import { Avatar } from "@/components/Avatar";
import { CtaButton } from "@/components/CtaButton";
import { createPageMetadata } from "@/lib/seo";
import { primaryCta, site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: `About ${site.name}: ${site.role} based in ${site.location}. Shopify apps, Django backends, React/Next.js frontends, and production deployment.`,
  path: "/about",
});

const skills = [
  "Shopify Development",
  "Shopify Apps",
  "Python",
  "Django",
  "JavaScript",
  "React.js",
  "Next.js",
  "REST APIs",
  "PostgreSQL",
  "VPS",
  "Web Portals",
  "Automation",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <Avatar size="lg" />
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">About</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {site.role}
          </h1>
          <p className="mt-4 text-lg text-foreground-secondary">
            {site.tagline}
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-2xl space-y-6 text-foreground-secondary">
        <p className="text-sm">
          <span className="text-accent font-medium">{site.availability}</span>
          {" · "}
          {site.replyTime}
        </p>
      </div>

      <h2 className="mt-12 text-lg font-semibold text-foreground">How I work</h2>
      <ul className="mt-4 max-w-2xl space-y-3 text-sm text-foreground-secondary">
        <li className="flex gap-3">
          <span className="text-accent">1.</span>
          <span>
            <strong className="text-foreground">Clarity first</strong> — short
            call or email to confirm scope and budget range.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-accent">2.</span>
          <span>
            <strong className="text-foreground">Ship in slices</strong> — usable
            milestones you can demo, not a big-bang reveal at the end.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-accent">3.</span>
          <span>
            <strong className="text-foreground">Handoff that sticks</strong> —
            deploy docs, env setup, and a clean repo you own.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-foreground">Skills</h2>
      <p className="mt-2 max-w-xl text-sm text-foreground-secondary">
        Chosen for maintainability not hype. Full list grouped by outcome on{" "}
        <a href="/services" className="text-accent hover:underline">
          Services
        </a>
        .
      </p>
      <div className="mt-4 max-w-3xl text-sm leading-7 text-foreground-secondary">
        {skills.map((item, index) => (
          <span key={item}>
            <span>{item}</span>
            {index < skills.length - 1 ? <span className="mx-2">·</span> : null}
          </span>
        ))}
      </div>

      <dl className="mt-12 grid max-w-xl gap-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Timezone</dt>
          <dd className="mt-1 font-medium text-foreground">
            {site.timezone} ({site.location})
          </dd>
        </div>
        <div>
          <dt className="text-muted">Reply time</dt>
          <dd className="mt-1 font-medium text-foreground">{site.replyTime}</dd>
        </div>
      </dl>

      <p className="mt-8 max-w-xl text-xs text-muted">
        Photo: <code className="text-muted">public/team.png</code>
      </p>

      <div className="mt-10">
        <CtaButton href={primaryCta.href} label={primaryCta.label} />
      </div>
    </div>
  );
}
