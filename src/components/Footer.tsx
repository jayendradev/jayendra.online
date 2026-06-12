import Link from "next/link";
import { nav, primaryCta, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <p className="font-semibold text-foreground">{site.role}</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          {site.location} · {site.typicalProject}
        </p>
        <p className="mt-2 text-sm text-accent">{site.availability}</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-3 inline-block text-sm text-accent hover:underline"
        >
          {site.email}
        </a>

        {site.linkedInUrl ? (
          <a
            href={site.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-muted hover:text-foreground"
          >
            LinkedIn →
          </a>
        ) : null}

        <nav className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-foreground-secondary">
          {nav.map((item, index) => (
            <span key={item.href} className="inline-flex items-center gap-2">
              {index > 0 ? <span className="text-muted">·</span> : null}
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            </span>
          ))}
          <span className="text-muted">·</span>
          <Link
            href={primaryCta.href}
            className="text-accent hover:underline"
          >
            {primaryCta.label}
          </Link>
        </nav>

        <p className="mt-10 text-xs text-muted">
          © {year} {site.domain}. {site.footerTagline}
        </p>
      </div>
    </footer>
  );
}
