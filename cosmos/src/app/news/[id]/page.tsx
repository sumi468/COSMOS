import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ArticlePlaceholder from "@/components/ArticlePlaceholder";
import { formatLocalDateTime, relativeTime } from "@/lib/format";
import { getAllNews } from "@/lib/news";

export const revalidate = 300;

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await getAllNews();
  const item = news.items.find((n) => n.id === params.id);
  if (!item) notFound();

  return (
    <PageShell>
      <Link href="/latest" className="text-sm text-cosmos-muted hover:text-white">&larr; Back to Latest</Link>

      <article className="mt-6 max-w-2xl">
        <div className="eyebrow text-cosmos-ice">{item.source}</div>
        <h1 className="mt-2 font-display text-2xl md:text-3xl leading-tight text-white">{item.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-cosmos-muted">
          <span>{formatLocalDateTime(item.publishedAt)}</span>
          <span className="text-cosmos-muted/40">&middot;</span>
          <span>{relativeTime(item.publishedAt)}</span>
          <span className="text-cosmos-muted/40">&middot;</span>
          <span className="rounded-full border border-cosmos-line px-2 py-0.5">{item.category}</span>
        </div>

        <div className="relative mt-6 aspect-video rounded-2xl overflow-hidden border border-cosmos-line">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt="" fill sizes="700px" className="object-cover" />
          ) : (
            <ArticlePlaceholder source={item.source} />
          )}
        </div>

        <div className="mt-6 border-t border-cosmos-line pt-6">
          <p className="eyebrow text-cosmos-muted mb-2">Summary</p>
          <p className="text-[15px] leading-relaxed text-cosmos-white/90 whitespace-pre-line">{item.summary}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-cosmos-line p-5">
          <p className="eyebrow text-cosmos-muted mb-1">Official Source</p>
          <p className="text-sm text-cosmos-muted mb-3">
            Published via {item.feedName}. COSMOS shows a short summary only &mdash; read the full article on{" "}
            {item.source}&rsquo;s own site.
          </p>
          <a
            href={item.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cosmos-ice text-cosmos-black text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Read official article &rarr;
          </a>
        </div>
      </article>
    </PageShell>
  );
}
