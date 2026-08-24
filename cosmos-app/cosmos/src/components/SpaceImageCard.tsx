import Image from "next/image";
import { formatLocalDate } from "@/lib/format";
import type { SpaceImage } from "@/types/cosmos";

export default function SpaceImageCard({ image, priority = false }: { image: SpaceImage; priority?: boolean }) {
  return (
    <div className="rounded-2xl border border-cosmos-line overflow-hidden">
      <div className="relative aspect-[4/3] bg-cosmos-panel2">
        {image.mediaType === "image" ? (
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-cosmos-muted px-6 text-center">
            Today&rsquo;s NASA feature is a video &mdash; view it at the official source below.
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="eyebrow text-cosmos-ice">{image.source} &middot; {formatLocalDate(image.date)}</p>
        <h3 className="mt-1.5 font-display text-base text-white leading-snug">{image.title}</h3>
        <p className="mt-1.5 text-sm text-cosmos-muted line-clamp-3">{image.explanation}</p>
        <p className="mt-2 text-xs text-cosmos-muted/70">Credit: {image.credit}</p>
        <a
          href={image.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-cosmos-ice hover:underline"
        >
          Read official source &rarr;
        </a>
      </div>
    </div>
  );
}
