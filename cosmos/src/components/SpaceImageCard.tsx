import Image from "next/image";
import { formatLocalDate } from "@/lib/format";
import { getLocalization } from "@/lib/localization";
import type { SpaceImage } from "@/types/cosmos";

export default function SpaceImageCard({ image, featured = false }: { image: SpaceImage; featured?: boolean }) {
  const { locale, copy } = getLocalization();
  const Heading = featured ? "h2" : "h3";

  return (
    <article className={`motion-card image-card overflow-hidden rounded-2xl border border-cosmos-line ${featured ? "lg:grid lg:grid-cols-[1.4fr_1fr]" : ""}`}>
      <div className={`relative aspect-[4/3] bg-cosmos-inset ${featured ? "lg:aspect-auto lg:min-h-[22rem]" : ""}`}>
        {image.mediaType === "image" ? (
          <Image
            src={image.imageUrl}
            alt={image.alt ?? image.title}
            fill
            sizes={featured ? "(min-width: 1024px) 54vw, 100vw" : "(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"}
            className={featured ? "object-contain" : "object-cover"}
            priority={featured}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-cosmos-muted">
            {copy.images.videoNotice}
          </div>
        )}
      </div>
      <div className={featured ? "p-5 lg:flex lg:flex-col lg:items-start lg:justify-center lg:p-8" : "p-5"}>
        <p className="eyebrow text-cosmos-accent">{image.source} &middot; {formatLocalDate(image.date, locale)}</p>
        <Heading className={featured ? "editorial-title lead-title mt-2" : "mt-2 font-display text-base font-medium leading-snug"}>{image.title}</Heading>
        <p className={`mt-2 text-sm leading-relaxed text-cosmos-muted ${featured ? "line-clamp-6" : "line-clamp-3"}`}>{image.explanation}</p>
        <p className="mt-3 text-xs text-cosmos-muted">{copy.images.credit} &middot; {image.credit}</p>
        <a
          href={image.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cosmos-accent hover:underline"
        >
          {copy.images.readSource} &rarr;
        </a>
      </div>
    </article>
  );
}
