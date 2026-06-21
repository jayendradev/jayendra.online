import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Shopify App Developer, Django, FastAPI, Golang & Next.js`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #0b0e13 0%, #111827 45%, #0b0e13 100%)",
          color: "#f9fafb",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#38bdf8",
          }}
        >
          {site.domain}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            fontWeight: 600,
            color: "#e5e7eb",
            maxWidth: 960,
            lineHeight: 1.25,
          }}
        >
          Shopify Apps · Full-Stack Web Systems
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 24,
            color: "#9ca3af",
            maxWidth: 960,
            lineHeight: 1.4,
          }}
        >
          Golang, FastAPI & Python/Django · React & Next.js · AWS & VPS
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 20,
            color: "#38bdf8",
          }}
        >
          {`${site.location} · ${site.availability}`}
        </div>
      </div>
    ),
    { ...size },
  );
}
