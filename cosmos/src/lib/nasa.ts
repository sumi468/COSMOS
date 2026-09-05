import { fetchFeed } from "@/lib/rss";
import { categorize } from "@/lib/categorize";
import { encodeId } from "@/lib/id";
import { getLastGood, setLastGood } from "@/lib/cache";
import { fetchCache } from "@/lib/fetchPolicy";
import { capSummary, extractLeadParagraphs, firstImageSrc, looksUnusable } from "@/lib/text";
import type { FetchResult, NewsItem, SpaceImage } from "@/types/cosmos";

// All endpoints below are NASA's own public, key-free RSS feeds — listed at
// https://www.nasa.gov/rss-feeds/. No scraping is used for news.
const NASA_FEEDS: Array<{ name: string; url: string }> = [
  { name: "NASA News Releases", url: "https://www.nasa.gov/news-release/feed/" },
  { name: "NASA Recently Published", url: "https://www.nasa.gov/feed/" },
  { name: "NASA Artemis", url: "https://www.nasa.gov/missions/artemis/feed/" },
  { name: "NASA Space Station", url: "https://www.nasa.gov/missions/station/feed/" }
];

const REVALIDATE_SECONDS = 600; // 10 min — see brief section 15 on caching politeness
const CACHE_KEY = "nasa-news";

/**
 * Builds the article summary. NASA's WordPress `content:encoded` field
 * contains the full article body, so we prefer pulling the first few real
 * paragraphs from there (a genuinely fuller, multi-sentence summary) and
 * only fall back to the short auto-excerpt `description` when no usable
 * body content is available. Either way, the result is capped with a
 * word/sentence-safe trim (see lib/text.ts) — never a raw substring cut.
 */
function buildSummary(description: string, contentHtml: string | undefined): string {
  const fromBody = extractLeadParagraphs(contentHtml, 3);
  if (fromBody && looksUnusable(fromBody) === "ok") {
    return capSummary(fromBody, 900);
  }
  if (description && looksUnusable(description) !== "too-short") {
    return capSummary(description, 900);
  }
  return fromBody ? capSummary(fromBody, 900) : description;
}

function buildImageUrl(enclosureImageUrl: string | undefined, contentHtml: string | undefined): string | undefined {
  return enclosureImageUrl || firstImageSrc(contentHtml);
}

export async function getNasaNews(): Promise<FetchResult<NewsItem>> {
  const errors: string[] = [];
  const collected: NewsItem[] = [];
  const seen = new Set<string>();
  const debug: Record<string, string> = {};

  await Promise.all(
    NASA_FEEDS.map(async (feed) => {
      try {
        const entries = await fetchFeed(feed.url, fetchCache(REVALIDATE_SECONDS));
        let feedCount = 0;
        for (const entry of entries) {
          if (!entry.link || !entry.title) continue;
          if (seen.has(entry.link)) continue;
          seen.add(entry.link);
          feedCount++;
          collected.push({
            id: encodeId(entry.link),
            source: "NASA",
            title: entry.title,
            summary: buildSummary(entry.description, entry.contentHtml),
            publishedAt: entry.publishedAt,
            officialUrl: entry.link,
            category: categorize(entry.title, entry.description),
            imageUrl: buildImageUrl(entry.enclosureImageUrl, entry.contentHtml),
            feedName: feed.name
          });
        }
        debug[feed.name] = `ok (${feedCount} articles)`;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        debug[feed.name] = `failed: ${message}`;
        errors.push(`NASAの最新情報を取得できませんでした（${feed.name}）: ${message}`);
      }
    })
  );

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[COSMOS] NASA feed status:", debug, `total articles: ${collected.length}`);
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

// --- NASA Astronomy Picture of the Day -------------------------------------
// https://api.nasa.gov/ — DEMO_KEY works with a low rate limit; set
// NASA_API_KEY on the server (never NEXT_PUBLIC_*) to raise it. Never
// embedded in client bundles: this function only ever runs on the server.
const APOD_CACHE_KEY = "nasa-apod";

export async function getApod(): Promise<{ image: SpaceImage | null; stale: boolean; error?: string }> {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, fetchCache(3600));
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    const image: SpaceImage = {
      id: encodeId(data.url ?? data.title ?? "apod"),
      title: data.title,
      date: data.date,
      explanation: data.explanation,
      // Images are served from apod.nasa.gov, not api.nasa.gov — see next.config.mjs.
      imageUrl: data.media_type === "image" ? data.url : data.thumbnail_url ?? data.url,
      hdImageUrl: data.hdurl,
      credit: data.copyright ? data.copyright.trim() : "NASA",
      source: "NASA APOD",
      officialUrl: "https://apod.nasa.gov/apod/astropix.html",
      mediaType: data.media_type === "video" ? "video" : "image"
    };
    setLastGood(APOD_CACHE_KEY, image);
    return { image, stale: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[COSMOS] APOD fetch failed:", message);
    }
    const fallback = getLastGood<SpaceImage>(APOD_CACHE_KEY);
    return {
      image: fallback?.value ?? null,
      stale: Boolean(fallback),
      error: "NASA APODを取得できませんでした"
    };
  }
}

// --- NASA Image and Video Library -------------------------------------------
// https://images-api.nasa.gov — public, key-free. Image files themselves are
// served from images-assets.nasa.gov (see next.config.mjs).
const GALLERY_CACHE_KEY = "nasa-gallery";

export async function searchNasaImages(query: string, limit = 12): Promise<{ images: SpaceImage[]; error?: string }> {
  try {
    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`,
      fetchCache(3600)
    );
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    const items = (data?.collection?.items ?? []).slice(0, limit);
    const images: SpaceImage[] = items.map((item: any) => {
      const meta = item.data?.[0] ?? {};
      // links[].rel: "preview" (thumb) | "canonical" (orig) | "captions". Prefer
      // an actual image rendition (render === "image"), which excludes captions.
      const preview = item.links?.find((l: any) => l.rel === "preview" && l.render === "image");
      const thumb = preview?.href ?? item.links?.find((l: any) => l.render === "image")?.href;
      return {
        id: encodeId(meta.nasa_id ?? thumb ?? meta.title),
        title: meta.title ?? "Untitled",
        date: meta.date_created ?? new Date().toISOString(),
        explanation: meta.description ?? "",
        imageUrl: thumb,
        credit: meta.photographer ?? meta.center ?? "NASA",
        source: "NASA Image and Video Library",
        officialUrl: `https://images.nasa.gov/details/${meta.nasa_id ?? ""}`,
        mediaType: "image"
      };
    });
    const withImages = images.filter((img) => img.imageUrl);
    if (withImages.length > 0) setLastGood(GALLERY_CACHE_KEY, withImages);
    return { images: withImages };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[COSMOS] NASA Image Library fetch failed:", message);
    }
    const fallback = getLastGood<SpaceImage[]>(GALLERY_CACHE_KEY);
    return { images: fallback?.value ?? [], error: "NASA画像ライブラリを取得できませんでした" };
  }
}
