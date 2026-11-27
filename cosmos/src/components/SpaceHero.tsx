import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { getLocalization } from "@/lib/localization";

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-editorial"
});

const SATURN_SOURCE = "https://science.nasa.gov/photojournal/so-far-from-home/";

const DESTINATIONS = [
  { key: "missions", href: "/missions" },
  { key: "upcoming", href: "/upcoming" },
  { key: "images", href: "/images" }
] as const;

export default function SpaceHero() {
  const { copy: { hero } } = getLocalization();

  return (
    <header className={`space-hero mb-10 ${editorial.variable}`}>
      <div className="hero-stage">
        <div className="hero-picture">
          <Image
            src="/hero/cassini-saturn.webp"
            alt={hero.photoAlt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1440px) 68vw, 900px"
            quality={90}
            priority
          />
        </div>
        <div className="hero-copy">
          <p className="hero-journal">{hero.journal}</p>
          <h1 className="hero-title">
            <span>{hero.title}</span>
            <span>{hero.titleSecond}</span>
          </h1>
          <p className="hero-description">{hero.description}</p>
          <div className="hero-actions">
            <Link className="motion-control hero-primary" href="/latest">
              {hero.start} <span className="action-arrow hero-arrow" aria-hidden="true" />
            </Link>
            <a className="motion-control hero-secondary" href="#dispatches">
              {hero.latest} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <a className="hero-credit" href={SATURN_SOURCE} target="_blank" rel="noopener noreferrer">
          <span>{hero.photoCaption}</span>
          <span>NASA / JPL-Caltech / SSI</span>
        </a>
      </div>
      <div className="hero-destinations">
        {DESTINATIONS.map(({ key, href }) => (
          <Link key={key} href={href} className="hero-destination">
            {hero.destinations[key]}
            <span className="destination-arrow hero-arrow" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </header>
  );
}
