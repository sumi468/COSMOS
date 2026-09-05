import { fetchFeed } from "@/lib/rss";
import { categorize } from "@/lib/categorize";
import { encodeId } from "@/lib/id";
import { getLastGood, setLastGood } from "@/lib/cache";
import { fetchCache } from "@/lib/fetchPolicy";
import { fetchArticleEnrichment } from "@/lib/articleEnrich";
import { capSummary, looksUnusable } from "@/lib/text";
import type { FetchResult, NewsItem } from "@/types/cosmos";

// JAXA's official English press release RSS (RDF/RSS 1.0), linked directly
// from JAXA's own "For Media" page (https://global.jaxa.jp/media.html →
// "You can find official JAXA press releases here and also RSS them.").
// This is the only JAXA feed COSMOS uses — no scraping of listing pages.
const JAXA_FEEDS: Array<{ name: string; url: string }> = [
  { name: "JAXA Press Release (English)", url: "https://global.jaxa.jp/rss/press.rdf" }
];

const REVALIDATE_SECONDS = 900; // JAXA publishes less frequently than NASA
const CACHE_KEY = "jaxa-news";
// Article pages don't change after publishing, so this can be cached hard.
const ENRICHMENT_REVALIDATE_SECONDS = 6 * 60 * 60;
// Cap how many article pages we fetch live per run, so a full cache miss
// (e.g. right after deploy, or in dev with caching disabled) can't fire off
// 20 simultaneous requests at JAXA's server. Once cached, subsequent runs
// hit Next's fetch cache instead of the network, so this only limits the
// "cold" burst, not steady-state freshness.
const MAX_ENRICHMENT_PER_RUN = 8;

/**
 * JAXA's own RSS `description` is frequently one of:
 *   1. A genuinely complete short blurb — fine, use as-is.
 *   2. Cut off mid-sentence/mid-word by JAXA's own feed generator — unusable
 *      as-is (would look broken), so we try to complete it from the article.
 *   3. A JS `location.href=...` redirect stub for "(Japanese Only)" releases
 *      that don't have an English page at all — always needs enrichment.
 * Either way we NEVER fabricate text: when enrichment also fails, we fall
 * back to the original (possibly short) description rather than inventing
 * anything, and openly show only what's real.
 */
async function buildJaxaArticle(
  description: string,
  officialUrl: string
): Promise<{ summary: string; imageUrl?: string }> {
  const verdict = looksUnusable(description);
  if (verdict === "ok") {
    return { summary: capSummary(description, 900) };
  }

  const enrichment = await fetchArticleEnrichment(officialUrl, ENRICHMENT_REVALIDATE_SECONDS);
  if (enrichment?.paragraphs && looksUnusable(enrichment.paragraphs) === "ok") {
    return { summary: capSummary(enrichment.paragraphs, 900), imageUrl: enrichment.imageUrl };
  }
  if (enrichment?.imageUrl && verdict !== "too-short") {
    // Got an image but the article text still wasn't clean — keep the
    // original description rather than showing unusable/garbled text.
    return { summary: description, imageUrl: enrichment.imageUrl };
  }
  // Nothing better available — be transparent rather than showing garbage.
  if (verdict === "redirect") {
    return { summary: "This is a Japanese-language press release. See the official source for full details." };
  }
  return { summary: description || "No summary available. See the official source for full details." };
}

export async function getJaxaNews(): Promise<FetchResult<NewsItem>> {
  const errors: string[] = [];
  const collected: NewsItem[] = [];
  const seen = new Set<string>();
  const debug: Record<string, string> = {};

  await Promise.all(
    JAXA_FEEDS.map(async (feed) => {
      try {
        const entries = await fetchFeed(feed.url, fetchCache(REVALIDATE_SECONDS));
        debug[feed.name] = `HTTP 200, ${entries.length} raw entries`;
        let feedCount = 0;

        const built = await Promise.all(
          entries
            .filter((entry) => entry.link && entry.title && !seen.has(entry.link))
            .map(async (entry, index) => {
              seen.add(entry.link);
              const { summary, imageUrl } =
                index < MAX_ENRICHMENT_PER_RUN
                  ? await buildJaxaArticle(entry.description, entry.link)
                  : { summary: capSummary(entry.description, 900), imageUrl: undefined };
              return { entry, summary, imageUrl };
            })
        );

        for (const { entry, summary, imageUrl } of built) {
          feedCount++;
          collected.push({
            id: encodeId(entry.link),
            source: "JAXA",
            title: entry.title,
            summary,
            publishedAt: entry.publishedAt,
            officialUrl: entry.link,
            category: categorize(entry.title, entry.description),
            imageUrl,
            feedName: feed.name
          });
        }
        debug[feed.name] = `ok (${feedCount} articles)`;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        debug[feed.name] = `failed: ${message}`;
        errors.push(`JAXAの最新情報を取得できませんでした（${feed.name}）: ${message}`);
      }
    })
  );

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[COSMOS] JAXA feed status:", debug, `total articles: ${collected.length}`);
  }

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
