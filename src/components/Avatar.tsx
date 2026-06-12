import { site } from "@/lib/site";
import fs from "fs";
import Image from "next/image";
import path from "path";

const SIZES = {
  sm: { box: 40, text: "text-sm" },
  md: { box: 56, text: "text-base" },
  lg: { box: 72, text: "text-lg" },
} as const;

type Size = keyof typeof SIZES;

function resolveAvatarSrc(): string | null {
  if (site.avatarUrl) return site.avatarUrl;
  const publicDir = path.join(process.cwd(), "public");
  for (const file of ["team.png", "avatar.jpg", "avatar.png", "avatar.webp"]) {
    if (fs.existsSync(path.join(publicDir, file))) {
      return `/${file}`;
    }
  }
  return null;
}

export function Avatar({
  size = "md",
  showRing = true,
}: {
  size?: Size;
  showRing?: boolean;
}) {
  const src = resolveAvatarSrc();
  const { box, text } = SIZES[size];
  const ring = showRing
    ? "ring-2 ring-accent/30 ring-offset-2 ring-offset-background"
    : "";

  if (src) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${ring}`}
        style={{ width: box, height: box }}
      >
        <Image
          src={src}
          alt={site.role}
          fill
          sizes={`${box}px`}
          className="object-cover"
          priority={size !== "sm"}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-surface-elevated font-semibold text-accent ${text} ${ring}`}
      style={{ width: box, height: box }}
      aria-hidden
    >
      {site.initials}
    </div>
  );
}
