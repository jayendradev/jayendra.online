const items = [
  {
    title: "Production-ready",
    detail:
      "Live apps with login, database, admin panels, APIs, and deployment.",
  },
  {
    title: "Performance & SEO",
    detail:
      "Fast pages, clean URLs, sitemaps, metadata, and Search Console setup.",
  },
  {
    title: "Direct collaboration",
    detail:
      "You work directly with me — clear scope, regular updates, and practical solutions.",
  },
  {
    title: "VPS, fixes & maintenance",
    detail:
      "Server setup, deployment, SSL, bug fixes, database issues, updates, backups, monitoring, and ongoing support.",
  },
] as const;

export function HeroTrust() {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.title}
          className="trust-card rounded-xl border border-border/80 bg-surface/80 px-4 py-3 backdrop-blur-sm"
        >
          <p className="text-sm font-medium text-foreground">{item.title}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-foreground-secondary">
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}
