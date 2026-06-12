import type { Metadata } from "next";
import { site } from "@/lib/site";

export const siteOrigin = `https://${site.domain}`;

export const seoKeywords = [
  "Shopify app developer",
  "Shopify developer India",
  "Python Django developer",
  "React Next.js developer",
  "freelance full stack developer",
  "Shopify app development",
  "Django web development",
  "Next.js portfolio",
  "REST API development",
  "VPS deployment",
  "ecommerce developer",
  "Jayendra developer",
] as const;

export const defaultOgImage = {
  url: "/icons/icon-512.png",
  width: 512,
  height: 512,
  alt: `${site.name} — ${site.role}`,
};

export function siteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${siteOrigin}${normalized}`;
}

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path = "",
  keywords,
}: PageSeo): Metadata {
  const url = siteUrl(path);

  return {
    title,
    description,
    keywords: [...(keywords ?? seoKeywords)],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.domain,
      locale: "en_IN",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: site.name,
  title: {
    default: `${site.name} | ${site.title}`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
  keywords: [...seoKeywords],
  authors: [{ name: site.name, url: siteOrigin }],
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.name,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteOrigin,
  },
  openGraph: {
    title: `${site.name} | ${site.title}`,
    description: site.tagline,
    url: siteOrigin,
    siteName: site.domain,
    locale: "en_IN",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.title}`,
    description: site.tagline,
    images: [defaultOgImage.url],
  },
  category: "technology",
};
