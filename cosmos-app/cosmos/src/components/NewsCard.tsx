import Link from "next/link";
import Image from "next/image";
import { relativeTime } from "@/lib/format";
import type { NewsItem } from "@/types/cosmos";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex gap-4 py-5 border-b border-cosmos-line last:border-b-0"
    >
      {item.imageUrl && (
        <div className="relative hidden sm:block w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-cosmos-panel2">
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 eyebrow text-cosmos-ice/80">
          <span>{item.source}</span>
          <span className="text-cosmos-muted/60">&middot;</span>
          <span className="text-cosmos-muted">{item.category}</span>
        </div>
        <h3 className="mt-1.5 font-display text-[15px] leading-snug text-white group-hover:text-cosmos-ice transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-cosmos-muted line-clamp-2">{item.summary}</p>
        <p className="mt-1.5 text-xs text-cosmos-muted/70">{relativeTime(item.publishedAt)}</p>
      </div>
    </Link>
  );
}
