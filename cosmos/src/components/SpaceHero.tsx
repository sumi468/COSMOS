import Link from "next/link";

const DESTINATIONS = [
  { number: "01", label: "Follow the missions", detail: "Human ambition. Cosmic scale.", href: "/missions" },
  { number: "02", label: "Catch the next launch", detail: "The countdown to what comes next.", href: "/upcoming" },
  { number: "03", label: "See the extraordinary", detail: "The universe, through a different lens.", href: "/images" }
];

export default function SpaceHero() {
  return (
    <header className="space-hero mb-10">
      <div className="hero-nebula ambient-motion" aria-hidden="true" />
      <div className="orbital-arrival" aria-hidden="true">
        <div className="orbital-art">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="planet" /><span className="orbit-moon" />
          <div className="planet-coordinate eyebrow">BEYOND THE KNOWN <span>+ EXPLORE</span></div>
        </div>
      </div>
      <div className="hero-topline eyebrow">
        <span className="flex items-center gap-3"><span className="signal-dot" /> Independent space journal</span>
        <span className="hero-edition">EARTH / OUR POINT OF DEPARTURE</span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow hero-kicker">For the endlessly curious</p>
        <h1 className="hero-title font-display">GO BEYOND.<br /><span>STAY CURIOUS.</span></h1>
        <p className="hero-description">A small window into an infinite universe.<br />Discover the missions, ideas, and moments<br className="hidden sm:block" /> taking us further.</p>
        <div className="hero-actions">
          <Link className="motion-control hero-primary" href="/latest">Start exploring <span className="action-arrow" aria-hidden="true">↗</span></Link>
          <a className="motion-control hero-secondary" href="#dispatches">The latest dispatches <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="hero-destinations">
        {DESTINATIONS.map((destination) => (
          <Link key={destination.number} href={destination.href} className="hero-destination">
            <span className="eyebrow destination-number">{destination.number}</span>
            <span><span className="destination-title">{destination.label}</span><span className="destination-detail">{destination.detail}</span></span>
            <span className="destination-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
