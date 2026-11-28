import Link from "next/link";
import Image from "next/image";
import { relativeTime } from "@/lib/format";
import NewsText from "@/components/NewsText";
import ArticlePlaceholder from "@/components/ArticlePlaceholder";
import { getLocalization } from "@/lib/localization";
import type { NewsItem } from "@/types/cosmos";

export default function NewsCard({ item }: { item: NewsItem }) {
  const { locale, copy } = getLocalization();

  return (
    <Link
      href={`/news/${item.id}`}
      className="motion-card news-row group flex gap-3 py-5 sm:gap-5 border-b border-cosmos-line last:border-b-0"
    >
      <div className="relative order-last mt-0.5 h-16 w-16 sm:order-first sm:h-20 sm:w-28 shrink-0 rounded-lg overflow-hidden bg-cosmos-inset">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="(min-width: 640px) 112px, 64px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ArticlePlaceholder />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 eyebrow text-cosmos-accent">
          <span>{item.source}</span>
          <span className="text-cosmos-muted">&middot;</span>
          <span className="text-cosmos-muted">{copy.category[item.category]}</span>
        </div>
        <h3 className="mt-1.5 font-display text-base font-medium leading-snug sm:text-lg text-cosmos-ink group-hover:text-cosmos-accent transition-colors line-clamp-2">
          <NewsText item={item} field="title" />
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-cosmos-muted"><NewsText item={item} field="summary" previewLength={160} /></p>
        <p className="mt-2 text-xs text-cosmos-muted">{relativeTime(item.publishedAt, locale)}</p>
      </div>
    </Link>
  );
}
