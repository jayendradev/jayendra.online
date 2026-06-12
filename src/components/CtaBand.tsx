import { CtaButton } from "@/components/CtaButton";
import { freeCheckCta } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="border-t border-border/60 bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <div className="cta-glow rounded-2xl border border-accent/25 bg-accent/5 px-6 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-semibold text-foreground">
            Get a practical first step
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-foreground-secondary">
            Send your website or store URL. I&apos;ll review it and suggest the
            first practical fix.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButton href={freeCheckCta.href} label={freeCheckCta.label} />
          </div>
        </div>
      </div>
    </section>
  );
}
