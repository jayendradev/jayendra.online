import Link from "next/link";
import { services } from "@/lib/services";

export function ServicesPreview() {
  return (
    <section className="border-y border-border/60 bg-[#f4f6f9] text-[#0f1419]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
            <p className="mt-2 max-w-xl text-[#3d4a5c]">
              Shopify, Django/Next.js, deployment, and automation — grouped by
              what clients actually need.
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-[#0369a1] hover:underline"
          >
            Full service list →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-[#dde3eb] bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3d4a5c]">
                {s.description}
              </p>
              <ul className="mt-3 space-y-1">
                {s.outcomes.slice(0, 3).map((outcome) => (
                  <li
                    key={outcome}
                    className="flex gap-2 text-sm text-[#1a2332]"
                  >
                    <span className="shrink-0 text-[#0369a1]">·</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
