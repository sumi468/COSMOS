import { NextResponse } from "next/server";
import { getNasaNews, getApod } from "@/lib/nasa";
import { getJaxaNews } from "@/lib/jaxa";
import { getUpcomingEvents } from "@/lib/launches";

/**
 * Debug/observability endpoint. Visit /api/health to see, per source,
 * exactly how many articles were fetched and any errors — e.g.
 *   "jaxa": { "count": 20, "sample": [...], "errors": [] }
 * A source silently returning 0 with no error is the signature of a feed
 * that parsed "successfully" but yielded nothing; a populated `errors`
 * array with an HTTP status means the fetch itself failed.
 */
export async function GET() {
  const [nasa, jaxa, apod, events] = await Promise.all([
    getNasaNews(),
    getJaxaNews(),
    getApod(),
    getUpcomingEvents()
  ]);

  return NextResponse.json({
    nasa: {
      count: nasa.items.length,
      stale: nasa.stale,
      errors: nasa.errors,
      updatedAt: nasa.updatedAt,
      withImage: nasa.items.filter((i) => i.imageUrl).length,
      sample: nasa.items.slice(0, 3).map((i) => ({
        title: i.title,
        summaryLength: i.summary.length,
        hasImage: Boolean(i.imageUrl)
      }))
    },
    jaxa: {
      count: jaxa.items.length,
      stale: jaxa.stale,
      errors: jaxa.errors,
      updatedAt: jaxa.updatedAt,
      withImage: jaxa.items.filter((i) => i.imageUrl).length,
      sample: jaxa.items.slice(0, 3).map((i) => ({
        title: i.title,
        summaryLength: i.summary.length,
        hasImage: Boolean(i.imageUrl)
      }))
    },
    apod: { ok: Boolean(apod.image), stale: apod.stale, error: apod.error },
    events: { count: events.items.length, stale: events.stale, errors: events.errors, updatedAt: events.updatedAt }
  });
}
