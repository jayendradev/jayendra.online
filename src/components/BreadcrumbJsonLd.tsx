import { siteUrl } from "@/lib/seo";

type Crumb = {
  name: string;
  path: string;
};

type Props = {
  items: Crumb[];
};

export function BreadcrumbJsonLd({ items }: Props) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
