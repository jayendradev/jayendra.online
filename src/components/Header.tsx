import { CtaButton } from "@/components/CtaButton";
import { HeaderNavDesktop, HeaderNavMobile } from "@/components/HeaderNav";
import { primaryCta, site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="animate-header-in relative sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-6 sm:px-5">
        <Link
          href="/"
          aria-label={`${site.name}.online — home`}
          className="group flex min-w-0 max-w-[50%] items-center gap-2 rounded-xl border border-border/80 bg-surface/70 px-2 py-1 font-semibold tracking-tight text-foreground shadow-sm backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-surface-elevated/90 hover:shadow-[0_0_20px_-12px_var(--color-accent)] sm:max-w-none sm:gap-2.5 sm:px-2.5 sm:py-1.5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-background/80 sm:h-8 sm:w-8 sm:rounded-lg">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              priority
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
            />
          </span>
          <span className="truncate pr-0.5 text-sm whitespace-nowrap sm:pr-1 sm:text-base">
            {site.name}
            <span className="font-normal text-foreground-secondary group-hover:text-accent/80">
              .online
            </span>
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <HeaderNavDesktop />
          <CtaButton
            href={primaryCta.href}
            label={primaryCta.label}
            className="max-w-[9.5rem] truncate px-3 py-2 text-xs sm:max-w-none sm:px-4 sm:py-2.5 sm:text-sm"
          />
          <HeaderNavMobile />
        </div>
      </div>
    </header>
  );
}
