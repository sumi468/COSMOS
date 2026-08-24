import Link from "next/link";
import Image from "next/image";
import { relativeTime } from "@/lib/format";
import type { NewsItem } from "@/types/cosmos";

export default function FeaturedNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Link
        href={`/news/${lead.id}`}
        className="group relative md:col-span-3 overflow-hidden rounded-2xl border border-cosmos-line min-h-[280px] flex flex-col justify-end"
      >
        {lead.imageUrl ? (
          <Image
            src={lead.imageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cosmos-panel2 to-cosmos-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="relative p-6">
          <div className="eyebrow text-cosmos-ice">{lead.source} &middot; {lead.category}</div>
          <h2 className="mt-2 font-display text-2xl leading-tight text-white max-w-lg">{lead.title}</h2>
          <p className="mt-2 text-sm text-white/75 max-w-md line-clamp-2">{lead.summary}</p>
          <p className="mt-3 text-xs text-white/50">{relativeTime(lead.publishedAt)}</p>
        </div>
      </Link>

      <div className="md:col-span-2 flex flex-col gap-4">
        {rest.slice(0, 2).map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="group relative overflow-hidden rounded-2xl border border-cosmos-line flex-1 min-h-[130px] flex flex-col justify-end"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 bg-cosmos-panel2" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="relative p-4">
              <div className="eyebrow text-cosmos-ice">{item.source}</div>
              <h3 className="mt-1 font-display text-base leading-snug text-white line-clamp-2">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-white/50">{relativeTime(item.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
