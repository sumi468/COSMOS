import Link from "next/link";

export default function SpaceHero() {
  return (
    <header className="space-hero mb-8">
      <div className="orbital-art" aria-hidden="true">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="planet" /><span className="orbit-moon" />
      </div>
      <div className="hero-copy relative z-10 max-w-xl">
        <p className="eyebrow text-cosmos-ice flex items-center gap-3"><span className="signal-dot" /> A window into the universe</p>
        <h1 className="mt-6 font-display text-[clamp(2.8rem,5.4vw,5rem)] leading-[1.02] tracking-[-0.055em] text-white">There’s more<br />out there<span className="text-cosmos-cyan">.</span></h1>
        <p className="mt-5 max-w-xs text-sm md:text-base leading-relaxed text-slate-300">Discover the missions, breakthroughs, and extraordinary moments beyond Earth.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="motion-control rounded-full bg-cosmos-ice text-cosmos-black px-5 py-3 text-sm font-medium hover:bg-white" href="/latest">Explore the latest <span className="action-arrow" aria-hidden="true">↗</span></Link>
          <Link className="motion-control rounded-full border border-white/20 bg-black/20 px-5 py-3 text-sm text-white hover:bg-white/10" href="/missions">Discover missions</Link>
        </div>
      </div>
      <div className="hero-caption eyebrow" aria-hidden="true">01 / BEYOND THE HORIZON</div>
    </header>
  );
}
