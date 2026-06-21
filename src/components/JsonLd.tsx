import { siteUrl } from "@/lib/seo";
import { serviceOfferings } from "@/lib/service-offerings";
import { site } from "@/lib/site";

export function JsonLd() {
  const personId = `${siteUrl()}#person`;
  const websiteId = `${siteUrl()}#website`;
  const businessId = `${siteUrl()}#business`;

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
        image: siteUrl("/team.png"),
        jobTitle: "Shopify App & Full-Stack Web Developer",
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
          "FastAPI",
          "Golang",
          "React",
          "Next.js",
          "REST APIs",
          "PostgreSQL",
          "AWS",
          "VPS Deployment",
          "Web Development",
          "SEO",
        ],
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: site.domain,
        url: siteUrl(),
        description: `${site.tagline} ${site.subtagline}`,
        inLanguage: "en-IN",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: `${site.name} — ${site.domain}`,
        url: siteUrl(),
        description: `${site.tagline} ${site.subtagline}`,
        email: site.email,
        image: siteUrl("/opengraph-image"),
        areaServed: "Worldwide",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        founder: { "@id": personId },
        serviceType: [
          "Shopify App Development",
          "Shopify Store Development",
          "Django Development",
          "FastAPI Development",
          "Golang Development",
          "Next.js Development",
          "React Development",
          "API Development",
          "Admin Dashboard Development",
          "VPS Deployment",
          "AWS Deployment",
          "Website Maintenance",
          "Performance Optimization",
          "SEO Improvements",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web Development Services",
          itemListElement: serviceOfferings.map((service, index) => ({
            "@type": "Offer",
            position: index + 1,
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              provider: { "@id": businessId },
            },
          })),
        },
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
