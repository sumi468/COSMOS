import { getAllNews } from "@/lib/news";
import { generateSummary, SummaryError } from "@/lib/aiSummary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/language";
import { summaryCopy } from "@/lib/summaryCopy";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  let errors = summaryCopy[DEFAULT_LOCALE].errors;
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      // Next can reconstruct request.url with an internal hostname (localhost).
      // Compare the browser origin to the actual incoming Host instead.
      if (new URL(origin).host !== request.headers.get("host")) return reply({ error: errors.invalidOrigin }, 403);
    } catch { return reply({ error: errors.invalidOrigin }, 403); }
  }

  try {
    // Accept an article ID and a supported locale. The server supplies the source and prompt.
    const raw = await request.text();
    if (raw.length > 2048) return reply({ error: errors.tooLarge }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return reply({ error: errors.invalidRequest }, 400); }
    const requestedLocale = body?.locale;
    if (requestedLocale !== undefined && !isLocale(requestedLocale)) {
      return reply({ error: errors.invalidLanguage }, 400);
    }
    const locale = isLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE;
    errors = summaryCopy[locale].errors;

    if (typeof body?.id !== "string" || !/^[A-Za-z0-9_-]{1,1500}$/.test(body.id)) {
      return reply({ error: errors.invalidArticle }, 400);
    }
    if (!process.env.GEMINI_API_KEY?.trim()) return reply({ error: errors.unavailable }, 503);

    const news = await getAllNews();
    const article = news.items.find((item) => item.id === body.id);
    if (!article) return reply({ error: errors.notFound }, 404);
    return reply(await generateSummary(article, locale));
  } catch (error) {
    return error instanceof SummaryError
      ? reply({ error: error.message }, error.status)
      : reply({ error: errors.failed }, 502);
  }
}
