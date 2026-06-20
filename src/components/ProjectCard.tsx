import type { Project } from "@/lib/projects";

const previewTone: Record<string, string> = {
  thebriefwire: "from-sky-600/25 via-sky-900/10 to-transparent",
  admss: "from-violet-600/20 via-slate-800/30 to-transparent",
  "ai-shopify-seo-app": "from-emerald-600/20 via-slate-800/20 to-transparent",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      id={project.slug}
      className="card-hover group flex flex-col rounded-2xl border border-border bg-surface p-6 hover:border-accent/40 hover:bg-surface-elevated"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
          <p className="mt-1 text-sm text-accent">{project.headline}</p>
        </div>
        {project.private ? (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            NDA / private
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">{project.problem}</p>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          What I built
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground-secondary">
          {project.built.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-accent">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-background px-2 py-1 font-mono text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm font-medium text-foreground">{project.result}</p>
      <p className="mt-2 text-xs text-muted italic">{project.clientAngle}</p>

      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 text-sm text-accent hover:underline"
        >
          {project.hrefLabel ?? "View live"} →
        </a>
      ) : null}
    </article>
  );
}

export function ProjectCardCompact({ project }: { project: Project }) {
  const tone =
    previewTone[project.slug] ??
    "from-accent/15 via-surface to-transparent";

  return (
    <article className="card-hover group overflow-hidden rounded-xl border border-border bg-surface hover:border-accent/40">
      <div
        className={`h-24 bg-gradient-to-br ${tone} border-b border-border/60`}
        aria-hidden
      />
      <div className="p-5">
        <h3 className="font-semibold text-foreground">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
          {project.headline}
        </p>
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-accent hover:underline"
          >
            {project.hrefLabel ?? project.href} →
          </a>
        ) : project.private ? (
          <span className="mt-3 inline-block rounded-full border border-border px-2 py-0.5 text-xs text-muted">
            NDA / private
          </span>
        ) : null}
      </div>
    </article>
  );
}
