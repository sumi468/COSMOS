import { getAllNews } from "@/lib/news";
import { generateSummary, SummaryError } from "@/lib/aiSummary";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      // Next can reconstruct request.url with an internal hostname (localhost).
      // Compare the browser origin to the actual incoming Host instead.
      if (new URL(origin).host !== request.headers.get("host")) return reply({ error: "Invalid request origin." }, 403);
    } catch { return reply({ error: "Invalid request origin." }, 403); }
  }
  try {
    // Accept only an article ID, never a client-supplied URL or prompt.
    const raw = await request.text();
    if (raw.length > 2048) return reply({ error: "Request is too large." }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request." }, 400); }
    if (typeof body?.id !== "string" || !/^[A-Za-z0-9_-]{1,1500}$/.test(body.id)) return reply({ error: "Invalid article ID." }, 400);
    if (!process.env.GEMINI_API_KEY?.trim()) return reply({ error: "AI summaries are not available yet. You can still read the source excerpt below." }, 503);
    const news = await getAllNews();
    const article = news.items.find((item) => item.id === body.id);
    if (!article) return reply({ error: "This article is no longer in the current feed. Please read the official source." }, 404);
    return reply(await generateSummary(article));
  } catch (error) {
    return reply({ error: error instanceof SummaryError ? error.message : "The summary could not be generated. Please try again." }, error instanceof SummaryError ? error.status : 502);
  }
}
