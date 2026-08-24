import { fetchFeed } from "@/lib/rss";
import { categorize } from "@/lib/categorize";
import { encodeId } from "@/lib/id";
import { getLastGood, setLastGood } from "@/lib/cache";
import type { FetchResult, NewsItem } from "@/types/cosmos";

// JAXA's official English press release RSS (RDF/RSS1.0), linked from
// https://global.jaxa.jp/media.html ("For Media" page). This is the only
// JAXA feed COSMOS uses — no scraping.
const JAXA_FEEDS: Array<{ name: string; url: string }> = [
  { name: "JAXA Press Release (English)", url: "https://global.jaxa.jp/rss/press.rdf" }
];

const REVALIDATE_SECONDS = 900; // JAXA publishes less frequently than NASA
const CACHE_KEY = "jaxa-news";

export async function getJaxaNews(): Promise<FetchResult<NewsItem>> {
  const errors: string[] = [];
  const collected: NewsItem[] = [];
  const seen = new Set<string>();

  await Promise.all(
    JAXA_FEEDS.map(async (feed) => {
      try {
        const entries = await fetchFeed(feed.url, REVALIDATE_SECONDS);
        for (const entry of entries) {
          if (!entry.link || !entry.title) continue;
          if (seen.has(entry.link)) continue;
          seen.add(entry.link);
          collected.push({
            id: encodeId(entry.link),
            source: "JAXA",
            title: entry.title,
            summary: entry.summary.length > 320 ? entry.summary.slice(0, 317) + "\u2026" : entry.summary,
            publishedAt: entry.publishedAt,
            officialUrl: entry.link,
            category: categorize(entry.title, entry.summary),
            imageUrl: entry.imageUrl,
            feedName: feed.name
          });
        }
      } catch (err) {
        errors.push(`JAXAの最新情報を取得できませんでした（${feed.name}）`);
      }
    })
  );

  collected.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (collected.length > 0) {
    setLastGood(CACHE_KEY, collected);
    return { items: collected, updatedAt: new Date().toISOString(), stale: false, errors };
  }

  const fallback = getLastGood<NewsItem[]>(CACHE_KEY);
  if (fallback) {
    return { items: fallback.value, updatedAt: fallback.updatedAt, stale: true, errors };
  }
  return { items: [], updatedAt: new Date().toISOString(), stale: false, errors };
}
