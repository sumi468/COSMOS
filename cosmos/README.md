# COSMOS

A space-news app built with Next.js 14, React, and TypeScript. It collects NASA and JAXA news, mission profiles, launch schedules, and space imagery.

## Run locally

Use Node.js 20 or newer. From `cosmos/`:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local` for the copy step.

## English AI summaries

Open a news article and choose **Generate summary**. COSMOS sends the available official source text to Google Gemini and returns a concise English brief. The original excerpt and official article link remain available, including when generation fails. Briefs are labeled as AI-generated; confirm details against the source.

Set these server-side environment variables locally or in your hosting project's environment settings, then restart/redeploy:

```dotenv
GEMINI_API_KEY=your-server-side-key
GEMINI_SUMMARY_MODEL=gemini-3.5-flash-lite
```

Create a key in [Google AI Studio](https://aistudio.google.com/apikey) using a **Free Tier project without Cloud Billing enabled**. Gemini 3.5 Flash-Lite offers free text input/output within its quota. Do not upgrade to a paid tier if you want to avoid charges. The app cannot detect your Google billing tier: a key from a paid project may incur charges. No OpenAI requests or paid-provider fallbacks remain. When the free quota is exhausted, generation stops with a retry message; the source excerpt stays available. Quotas and availability depend on Google's current terms and your account. Free-tier data can be used to improve Google's products; COSMOS sends only the public article title and text.

Never put the key in a `NEXT_PUBLIC_*` variable or commit `.env.local`. Without a key, the app still works and the summary button reports that AI summaries are unavailable.

The implementation uses the [Gemini Interactions API](https://ai.google.dev/api/interactions-api). It generates only on a button click, validates the article against current feeds, uses English-only summarization instructions, and rejects empty, refused, or incomplete output. Requests time out after 25 seconds. Successful generations are cached for 24 hours by article content and model, with a maximum of 300 entries. Concurrent requests for the same content share a generation. Each server process allows at most 20 new generations per minute and four concurrent generations. See [Google's pricing](https://ai.google.dev/gemini-api/docs/pricing) for the current free-tier terms.

These caches and limits are process-local; they reset on restarts and are not shared across serverless instances. For a high-traffic public deployment, add shared storage and a deployment-level rate limit. Source input is bounded to 18,000 characters. NASA provides article body text through RSS; JAXA may supply a shorter excerpt or enriched lead paragraphs, so a brief may not cover the full article. Articles no longer present in current feeds cannot be summarized.

## Interface

The app uses a deep-space star field, an illustrated planetary horizon, orbit details, and translucent panels. Desktop uses a sticky sidebar; mobile uses bottom navigation. Decorative visuals are CSS-only, need no external image download, and do not obscure article text.

## Data sources

- NASA news: `https://www.nasa.gov/news-release/feed/`, `https://www.nasa.gov/feed/`, Artemis and station feeds.
- JAXA news: `https://global.jaxa.jp/rss/press.rdf`. Incomplete descriptions can be enriched from official article pages.
- NASA APOD: `https://api.nasa.gov/planetary/apod` (`NASA_API_KEY` optional).
- NASA Image Library: `https://images-api.nasa.gov/search`.
- Launch Library 2: `https://ll.thespacedevs.com/2.2.0/launch/upcoming/` (`LAUNCH_LIBRARY_API_KEY` optional).
- Mission profiles are curated reference information; consult linked official pages for current status.

`/api/health` reports upstream feed health. Source failures show a notice and can fall back to process-local last-known-good data.

## Checks

```sh
npm test
npx tsc --noEmit
npm run lint
npm run build
npm start
```

Tests mock the AI provider: English instructions, source input, output parsing, concurrent deduplication, cache invalidation, refusal/incomplete output, retry, timeout, and request limits. A real generation requires your configured API key and is a separate deployment check.

## Deploy

Import the GitHub repository into your Next.js-compatible host with **Root Directory: `cosmos`**. Configure `GEMINI_API_KEY` and optional source keys in the host environment. Build with `npm run build` and start with `npm start` when self-hosting. Never expose server credentials in client bundles.

COSMOS is independent and is not affiliated with NASA or JAXA. News and imagery link to their sources. Launch data is provided by The Space Devs; third-party content remains subject to its source's usage policy.
