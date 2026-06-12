export type Project = {
  slug: string;
  name: string;
  headline: string;
  problem: string;
  built: string[];
  stack: string[];
  result: string;
  clientAngle: string;
  href?: string;
  hrefLabel?: string;
  private?: boolean;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "thebriefwire",
    name: "TheBriefWire",
    headline:
      "A live news platform built with Next.js, Django, PostgreSQL, RSS automation, SEO pages, and VPS deployment.",
    problem:
      "A publisher needed a fast, SEO-ready news site—not a template—with ingestion, categories, and live performance.",
    built: [
      "Next.js frontend with Django API backend",
      "RSS ingestion pipeline and category taxonomy",
      "SEO metadata, sitemaps, and Search Console–friendly structure",
      "VPS deployment with Nginx, PostgreSQL, and caching",
    ],
    stack: ["Next.js", "Django", "PostgreSQL", "Nginx", "Redis"],
    result:
      "Live production site at thebriefwire.com with structured publishing and search visibility—not a mockup.",
    clientAngle: "I can build content and media sites end to end.",
    href: process.env.NEXT_PUBLIC_BRIEFWIRE_URL ?? "https://thebriefwire.com",
    hrefLabel: "thebriefwire.com",
    featured: true,
  },
  {
    slug: "ai-shopify-seo-app",
    name: "AI Shopify SEO App",
    headline:
      "A Shopify app for AI product descriptions and SEO optimization.",
    problem:
      "Merchants spent hours writing product copy and meta tags that still missed search intent.",
    built: [
      "Shopify API integration (OAuth, webhooks, billing)",
      "AI-assisted product descriptions tuned for catalog tone",
      "SEO fields (titles, meta) at scale with review workflow",
      "Public App Store listing and merchant support",
    ],
    stack: ["Node.js", "Shopify API", "React", "LLM APIs"],
    result:
      "Live App Store app used by real stores for AI descriptions and SEO—not a demo theme.",
    clientAngle:
      "I can extend Shopify stores with custom apps and AI catalog workflows.",
    href:
      process.env.NEXT_PUBLIC_SHOPIFY_APP_URL ??
      "https://apps.shopify.com/ai-product-descriptions-seo",
    hrefLabel: "apps.shopify.com/ai-product-descriptions-seo",
    featured: true,
  },
  {
    slug: "admss",
    name: "ADMSS Portal",
    headline:
      "A private Django + PostgreSQL business portal with authentication, reports, and admin workflows.",
    problem:
      "An organization needed internal dashboards, role-based access, and private data—without exposing anything publicly.",
    built: [
      "Authentication, sessions, and role-based permissions",
      "Admin dashboards and operational reports",
      "Private data models with audit-friendly workflows",
      "Hardened deployment (private network / access controls)",
    ],
    stack: ["Django", "PostgreSQL", "REST APIs", "RBAC"],
    result:
      "Daily-use internal portal for staff; sensitive data stays behind login. Details under NDA.",
    clientAngle: "I can build portals for schools, businesses, and internal ops.",
    private: true,
    featured: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
