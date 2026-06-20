export type Service = {
  title: string;
  description: string;
  outcomes: string[];
};

export const services: Service[] = [
  {
    title: "Shopify Development",
    description:
      "Bug fixes, SEO improvements, and custom app work for Shopify stores.",
    outcomes: [
      "Shopify bug fixing",
      "Product SEO improvement",
      "Product description automation",
      "Shopify app and API work",
      "Store speed and technical fixes",
    ],
  },
  {
    title: "Django / Next.js Development",
    description:
      "Business portals, news sites, and full-stack apps with Django, FastAPI, Golang, auth, and PostgreSQL.",
    outcomes: [
      "Business portals",
      "News websites",
      "Admin dashboards",
      "API development",
      "PostgreSQL integration",
    ],
  },
  {
    title: "Deployment & Maintenance",
    description:
      "Production server setup, SSL, backups, and ongoing troubleshooting.",
    outcomes: [
      "VPS setup",
      "Nginx + Gunicorn",
      "SSL setup",
      "PostgreSQL backup",
      "Server troubleshooting",
    ],
  },
  {
    title: "Automation",
    description:
      "Backend automation, data exports, and AI-assisted content workflows.",
    outcomes: [
      "Web scraping",
      "CSV/Excel export",
      "AI content automation",
      "Backend task automation",
    ],
  },
];
