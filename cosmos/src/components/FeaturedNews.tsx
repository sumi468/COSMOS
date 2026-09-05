import Link from "next/link";
import Image from "next/image";
import { relativeTime } from "@/lib/format";
import { previewText } from "@/lib/text";
import type { NewsItem } from "@/types/cosmos";

export default function FeaturedNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  const secondary = rest.slice(0, 2);

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
      {/* Lead story — image sits in normal flow (no text-over-image scrim),
          so the layout degrades gracefully to a pure text teaser when
          there's no image, instead of needing a placeholder. */}
      <Link href={`/news/${lead.id}`} className="group block lg:col-span-2">
        {lead.imageUrl && (
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-cosmos-panel2">
            <Image
              src={lead.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          </div>
        )}
        <div className={lead.imageUrl ? "mt-5" : ""}>
          <div className="eyebrow text-cosmos-ice">
            {lead.source} &middot; {lead.category}
          </div>
          <h2 className="mt-2.5 font-display text-2xl md:text-3xl leading-[1.15] text-white group-hover:text-cosmos-ice transition-colors">
            {lead.title}
          </h2>
          <p className="mt-3 text-[15px] text-cosmos-muted max-w-xl">{previewText(lead.summary, 170)}</p>
          <p className="mt-3 text-xs text-cosmos-muted/70">{relativeTime(lead.publishedAt)}</p>
        </div>
      </Link>

      {/* Secondary stories — a slim editorial list, visually subordinate to
          the lead rather than a repeated identical card. */}
      {secondary.length > 0 && (
        <div className="flex flex-col divide-y divide-cosmos-line lg:border-l lg:border-cosmos-line lg:pl-8 lg:divide-y-0 lg:gap-6">
          {secondary.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group flex gap-3.5 py-5 first:pt-0 lg:py-0"
            >
              {item.imageUrl && (
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-cosmos-panel2">
                  <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="eyebrow text-cosmos-ice/80">{item.source}</div>
                <h3 className="mt-1 font-display text-[15px] leading-snug text-white group-hover:text-cosmos-ice transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-cosmos-muted/70">{relativeTime(item.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
