import { siteUrl } from "@/lib/seo";
import { projects } from "@/lib/projects";

export function WorkJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Work & Case Studies",
    description:
      "Production web projects including Shopify apps, news platforms, and business portals.",
    url: siteUrl("/work"),
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.name,
        description: project.headline,
        url: project.href ?? siteUrl(`/work#${project.slug}`),
        keywords: project.stack.join(", "),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
