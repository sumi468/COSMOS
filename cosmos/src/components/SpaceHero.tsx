import Link from "next/link";
import { getLocalization } from "@/lib/localization";

const DESTINATIONS = [
  { number: "01", key: "missions", href: "/missions" },
  { number: "02", key: "upcoming", href: "/upcoming" },
  { number: "03", key: "images", href: "/images" }
] as const;

export default function SpaceHero() {
  const { copy: { hero } } = getLocalization();

  return (
    <header className="space-hero mb-10">
      <div className="hero-nebula ambient-motion" aria-hidden="true" />
      <div className="orbital-arrival" aria-hidden="true">
        <div className="orbital-art">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="planet" /><span className="orbit-moon" />
          <div className="planet-coordinate eyebrow">{hero.coordinate} <span>{hero.explore}</span></div>
        </div>
      </div>
      <div className="hero-topline eyebrow">
        <span className="flex items-center gap-3"><span className="signal-dot" /> {hero.journal}</span>
        <span className="hero-edition">{hero.edition}</span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow hero-kicker">{hero.kicker}</p>
        <h1 className="hero-title font-display">{hero.title}<br /><span>{hero.titleSecond}</span></h1>
        <p className="hero-description">{hero.description}<br />{hero.descriptionSecond}<br className="hidden sm:block" /> {hero.descriptionThird}</p>
        <div className="hero-actions">
          <Link className="motion-control hero-primary" href="/latest">{hero.start} <span className="action-arrow" aria-hidden="true">↗</span></Link>
          <a className="motion-control hero-secondary" href="#dispatches">{hero.latest} <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="hero-destinations">
        {DESTINATIONS.map((destination) => (
          <Link key={destination.number} href={destination.href} className="hero-destination">
            <span className="eyebrow destination-number">{destination.number}</span>
            <span><span className="destination-title">{hero.destinations[destination.key].label}</span><span className="destination-detail">{hero.destinations[destination.key].detail}</span></span>
            <span className="destination-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
