import Link from "next/link";

type Props = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
};

const variants = {
  primary:
    "rounded-full border border-border bg-surface/80 px-5 py-2.5 font-mono font-medium text-accent backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-surface-elevated/90 hover:shadow-[0_0_24px_-10px_var(--color-accent)]",
  secondary:
    "card-hover rounded-lg border border-border bg-surface px-5 py-2.5 hover:bg-surface-elevated text-foreground",
  ghost:
    "rounded-lg px-5 py-2.5 text-muted hover:text-foreground transition-colors",
};

export function CtaButton({
  href,
  label,
  variant = "primary",
  className = "",
  onClick,
}: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center text-sm ${variants[variant]} ${className}`}
    >
      {label}
    </Link>
  );
}
