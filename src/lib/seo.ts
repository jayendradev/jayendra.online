import type { Metadata } from "next";
import { site } from "@/lib/site";

export const siteOrigin = `https://${site.domain}`;

export const siteDescription = `${site.tagline} ${site.subtagline}`;

export const seoKeywords = [
  "Shopify app developer",
  "Shopify developer India",
  "Python Django developer",
  "FastAPI developer",
  "Golang developer",
  "React Next.js developer",
  "freelance full stack developer",
  "freelance web developer India",
  "Shopify app development",
  "Django web development",
  "FastAPI development",
  "Next.js developer India",
  "REST API development",
  "VPS deployment",
  "AWS deployment",
  "AWS developer",
  "ecommerce developer",
  "PostgreSQL developer",
  "admin dashboard developer",
  "website bug fixes",
  "website maintenance",
  "full stack developer India",
  "Jayendra developer",
  "jayendra.online",
] as const;

export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — Shopify App Developer, Django, FastAPI, Golang & Next.js`,
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
  description: siteDescription,
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
    languages: {
      "en-IN": siteOrigin,
    },
  },
  openGraph: {
    title: `${site.name} | ${site.title}`,
    description: siteDescription,
    url: siteOrigin,
    siteName: site.domain,
    locale: "en_IN",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.title}`,
    description: siteDescription,
    images: [defaultOgImage.url],
  },
  category: "technology",
  verification: {
    google: "obln3DtLRLMD2Fhd9q2i9n3gVdZbo1bTvj5oTa1V3Tg",
  },
};
