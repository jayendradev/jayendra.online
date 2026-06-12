import type { Service } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card-hover rounded-2xl border border-border bg-surface p-6 hover:border-accent/30">
      <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
        {service.description}
      </p>
      <ul className="mt-4 space-y-2">
        {service.outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-2 text-sm text-foreground-secondary">
            <span className="text-accent shrink-0">✓</span>
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
