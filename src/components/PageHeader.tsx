type Props = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-12 max-w-2xl">
      <h1 className="animate-hero-in text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="animate-hero-in-delay-1 mt-4 text-lg leading-relaxed text-foreground-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}
