import { fetchFeed } from "@/lib/rss";
import { categorize } from "@/lib/categorize";
import { encodeId } from "@/lib/id";
import { getLastGood, setLastGood } from "@/lib/cache";
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

export async function getNasaNews(): Promise<FetchResult<NewsItem>> {
  const errors: string[] = [];
  const collected: NewsItem[] = [];
  const seen = new Set<string>();

  await Promise.all(
    NASA_FEEDS.map(async (feed) => {
      try {
        const entries = await fetchFeed(feed.url, REVALIDATE_SECONDS);
        for (const entry of entries) {
          if (!entry.link || !entry.title) continue;
          if (seen.has(entry.link)) continue;
          seen.add(entry.link);
          collected.push({
            id: encodeId(entry.link),
            source: "NASA",
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
        errors.push(`NASAの最新情報を取得できませんでした（${feed.name}）`);
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

// --- NASA Astronomy Picture of the Day -------------------------------------
// https://api.nasa.gov/ — DEMO_KEY works with a low rate limit; set
// NASA_API_KEY on the server (never NEXT_PUBLIC_*) to raise it. Never
// embedded in client bundles: this function only ever runs on the server.
const APOD_CACHE_KEY = "nasa-apod";

export async function getApod(): Promise<{ image: SpaceImage | null; stale: boolean; error?: string }> {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error(`APOD responded ${res.status}`);
    const data = await res.json();
    const image: SpaceImage = {
      id: encodeId(data.url ?? data.title ?? "apod"),
      title: data.title,
      date: data.date,
      explanation: data.explanation,
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
    const fallback = getLastGood<SpaceImage>(APOD_CACHE_KEY);
    return {
      image: fallback?.value ?? null,
      stale: Boolean(fallback),
      error: "NASA APODを取得できませんでした"
    };
  }
}

// --- NASA Image and Video Library -------------------------------------------
// https://images-api.nasa.gov — public, key-free.
const GALLERY_CACHE_KEY = "nasa-gallery";

export async function searchNasaImages(query: string, limit = 12): Promise<{ images: SpaceImage[]; error?: string }> {
  try {
    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Image library responded ${res.status}`);
    const data = await res.json();
    const items = (data?.collection?.items ?? []).slice(0, limit);
    const images: SpaceImage[] = items.map((item: any) => {
      const meta = item.data?.[0] ?? {};
      const thumb = item.links?.find((l: any) => l.render === "image")?.href ?? item.links?.[0]?.href;
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
    if (images.length > 0) setLastGood(GALLERY_CACHE_KEY, images);
    return { images };
  } catch (err) {
    const fallback = getLastGood<SpaceImage[]>(GALLERY_CACHE_KEY);
    return { images: fallback?.value ?? [], error: "NASA画像ライブラリを取得できませんでした" };
  }
}
