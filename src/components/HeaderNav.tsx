"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  delay,
  size = "md",
  onNavigate,
}: {
  href: string;
  label: string;
  delay: number;
  size?: "md" | "sm" | "mobile";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href);

  if (size === "mobile") {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
          active
            ? "bg-accent/10 text-accent"
            : "text-foreground-secondary hover:bg-surface-elevated hover:text-foreground"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`nav-link nav-link-in relative whitespace-nowrap transition-colors ${
        size === "sm" ? "pb-1 text-xs" : "pb-0.5 text-sm"
      } ${active ? "nav-link-active text-accent" : "text-foreground-secondary hover:text-foreground"}`}
      style={{ "--nav-delay": `${delay}ms` } as React.CSSProperties}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function HeaderNavDesktop() {
  return (
    <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
      {nav.map((item, index) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          delay={80 + index * 60}
        />
      ))}
    </nav>
  );
}

export function HeaderNavMobile() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-surface/70 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-surface-elevated/90"
      >
        <MenuIcon open={open} />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-14 z-40 bg-background/60 backdrop-blur-[2px] sm:top-16"
            onClick={closeMenu}
          />
          <nav
            id="mobile-nav-panel"
            className="fixed left-0 right-0 top-14 z-50 border-b border-border/60 bg-background/95 px-4 py-4 shadow-lg backdrop-blur-md sm:top-16"
            aria-label="Main navigation"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  delay={0}
                  size="mobile"
                  onNavigate={closeMenu}
                />
              ))}
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
