import { siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export function JsonLd() {
  const personId = `${siteUrl()}#person`;
  const websiteId = `${siteUrl()}#website`;

  const sameAs = [site.linkedInUrl].filter(Boolean) as string[];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: siteUrl(),
        email: site.email,
        jobTitle: "Shopify App Developer",
        description: site.tagline,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        knowsAbout: [
          "Shopify",
          "Shopify Apps",
          "Python",
          "Django",
          "React",
          "Next.js",
          "REST APIs",
          "PostgreSQL",
          "Web Development",
        ],
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: site.domain,
        url: siteUrl(),
        description: site.tagline,
        inLanguage: "en-IN",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl()}#business`,
        name: site.domain,
        url: siteUrl(),
        description: site.tagline,
        email: site.email,
        areaServed: "Worldwide",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        founder: { "@id": personId },
        serviceType: [
          "Shopify App Development",
          "Django Development",
          "Next.js Development",
          "API Development",
          "VPS Deployment",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
