export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-grid absolute inset-0" />
      <div className="hero-orb hero-orb-1 absolute -left-24 top-1/4 h-72 w-72 rounded-full" />
      <div className="hero-orb hero-orb-2 absolute -right-16 top-0 h-96 w-96 rounded-full" />
      <div className="hero-orb hero-orb-3 absolute bottom-0 left-1/3 h-64 w-64 rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(56,189,248,0.14),transparent)]" />
    </div>
  );
}
