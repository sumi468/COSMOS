import { NextResponse } from "next/server";
import { getAllNews } from "@/lib/news";
import { getUpcomingEvents } from "@/lib/launches";

export async function GET() {
  const [news, events] = await Promise.all([getAllNews(), getUpcomingEvents()]);
  return NextResponse.json({
    news: { count: news.items.length, stale: news.stale, errors: news.errors, updatedAt: news.updatedAt },
    events: { count: events.items.length, stale: events.stale, errors: events.errors, updatedAt: events.updatedAt }
  });
}
