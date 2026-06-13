export const site = {
  name: "Jayendra",
  fullName: "",
  shortName: "",
  role: "Shopify App Developer | Python/Django | React & Next.js",
  initials: "S",
  domain: "jayendra.online",
  title: "Shopify App Developer | Python/Django | React & Next.js",
  tagline:
    "Shopify Apps · Full-Stack Web Systems · Golang & Python/Django Backends · React & Next.js Frontends.",
  subtagline:
    "REST APIs · RDBMS Databases · VPS Deployment · Production-Ready Software for Real Businesses",
  heroDetail:
    "Practical web tools for founders, publishers, Shopify store owners, schools, and small businesses — built with clean code, real features, and proper deployment.",
  availability: "Available for freelance projects",
  footerTagline: "Production web apps — not mockups.",
  email: "contact@jayendra.online",
  location: "India (IST)",
  timezone: "Asia/Kolkata",
  replyTime: "Usually replies within 24–48 hours",
  typicalProject: "Small fixes to 2–8 week builds",
  /** Photo: public/team.png (or avatar.jpg) — or NEXT_PUBLIC_AVATAR_URL */
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL ?? "",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  linkedInUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const primaryCta = {
  label: "Discuss your project",
  href: "/contact",
} as const;

export const freeCheckCta = {
  label: "Get Free Website Check",
  href: "/contact?topic=website-check",
} as const;
