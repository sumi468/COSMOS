# COSMOS — Explore What's Happening Beyond Earth.

COSMOS is a Next.js (App Router) + TypeScript app that aggregates **real, official**
NASA and JAXA data — news, missions, upcoming launches, and space imagery — into a
single, calm, readable app. No AI-generated news, no invented dates, no fake
missions: every fact comes from a live feed/API and links back to its official
source.

## 1. What's implemented

- **Home** — Featured stories, Latest news, Upcoming events, Missions in focus
- **Latest** — full NASA/JAXA news list with source filter, category filter, and search
- **News detail** — summary + "Read official article →" link (never the full body)
- **Missions** — curated real mission profiles (Artemis, ISS, JWST, Hubble, H3, HTV-X, Hayabusa2#, SLIM), each linking to its official page
- **Upcoming** — real launch schedule from Launch Library 2, with live T‑minus countdowns in the visitor's local time
- **Images** — NASA Astronomy Picture of the Day + NASA Image and Video Library search
- **Search** — across news and missions
- **Settings** — lists every data source in use, with links
- **Error handling** — if a source is unreachable, COSMOS shows a clear notice and falls back to the last successfully fetched data instead of a blank screen
- **Caching** — server-side `fetch` revalidation (10–30 min depending on source) so feeds aren't hammered
- **Responsive** — sidebar nav on desktop, bottom tab bar on mobile
- **PWA** — manifest, generated icons, offline-capable app-shell service worker

## 2. Data sources (all official, all key-free except where noted)

| Source | Type | Endpoint |
|---|---|---|
| NASA News Releases | RSS | `https://www.nasa.gov/news-release/feed/` |
| NASA Recently Published | RSS | `https://www.nasa.gov/feed/` |
| NASA Artemis | RSS | `https://www.nasa.gov/missions/artemis/feed/` |
| NASA Space Station | RSS | `https://www.nasa.gov/missions/station/feed/` |
| JAXA Press Release (English) | RSS/RDF | `https://global.jaxa.jp/rss/press.rdf` |
| NASA APOD | REST API | `https://api.nasa.gov/planetary/apod` (DEMO_KEY works out of the box) |
| NASA Image and Video Library | REST API | `https://images-api.nasa.gov/search` (no key) |
| Launch Library 2 (The Space Devs) | REST API | `https://ll.thespacedevs.com/2.2.0/launch/upcoming/` (no key required) |

Full list: `src/lib/nasa.ts`, `src/lib/jaxa.ts`, `src/lib/launches.ts`.

**Why no scraping:** every source above publishes a structured, public feed or API,
so COSMOS never parses NASA/JAXA HTML directly. JAXA's Japanese-language site does
not currently offer a public press RSS for general users (their old public RSS
service was discontinued in 2021 per `jaxa.jp/press/about`), so COSMOS uses JAXA's
official **English** press RSS instead, linked from JAXA's own "For Media" page.

**Missions** (`src/lib/missions.ts`) are static, hand-curated reference profiles —
this is intentional: a mission's identity ("what is Artemis") doesn't need to be
re-fetched every page load the way news does. Each entry links to the mission's
official page for guaranteed up-to-date status.

## 3. Architecture

```
src/
├─ app/
│  ├─ page.tsx                Home
│  ├─ latest/page.tsx         All news + filters + search
│  ├─ news/[id]/page.tsx      News detail
│  ├─ missions/page.tsx       Mission list
│  ├─ missions/[slug]/page.tsx
│  ├─ upcoming/page.tsx       Launch schedule
│  ├─ upcoming/[id]/page.tsx  Event detail + countdown
│  ├─ images/page.tsx         APOD + image gallery
│  ├─ search/page.tsx
│  ├─ settings/page.tsx       Data-source transparency page
│  ├─ api/health/route.ts     JSON status of upstream sources
│  └─ layout.tsx, globals.css
├─ components/                Presentational + a couple of small client islands
├─ lib/
│  ├─ nasa.ts, jaxa.ts        Fetch + normalize each agency's feeds
│  ├─ news.ts                 Merge, sort, filter
│  ├─ launches.ts             Launch Library 2 client
│  ├─ missions.ts             Curated mission data
│  ├─ rss.ts                  Generic RSS 2.0 / RDF / Atom parser
│  ├─ categorize.ts           Keyword categorizer (derived from the article text)
│  ├─ cache.ts                Last-known-good in-memory fallback
│  ├─ format.ts                Dates, relative time, countdowns
│  └─ id.ts                   URL ↔ route-id encoding (no database needed)
└─ types/cosmos.ts             Shared domain types
```

Almost everything is a **React Server Component** that fetches on the server —
there's no client-side data fetching, so there's nothing to leak an API key
through. The two exceptions are `Navigation.tsx` (needs the current route to
highlight the active tab) and `CountdownTicker.tsx` (needs `setInterval` to tick
every second); both are small, isolated `"use client"` islands.

## 4. Environment variables

Copy `.env.example` to `.env.local`:

```
NASA_API_KEY=              # optional — raises the APOD/Image Library rate limit above DEMO_KEY
LAUNCH_LIBRARY_API_KEY=    # optional — raises the Launch Library 2 rate limit
```

Neither is required to run the app; both are server-only and are **never**
exposed with a `NEXT_PUBLIC_*` prefix.

## 5. Setup

```bash
npm install
npm run dev       # http://localhost:3000
```

```bash
npm run build     # production build
npm run start     # run the production build
```

> **A note on this delivery:** this project was generated in a sandboxed
> environment with no outbound network access, so `npm install` / `npm run build`
> could not be executed here to produce a build log. The code was written and
> reviewed carefully (including a manual TypeScript-correctness pass), but please
> run `npm install && npm run build` yourself as the first step — and open an
> issue/tell me what the error says if anything surfaces, so it can be fixed.

## 6. Deploying to Vercel

1. Push this project to a Git repository.
2. Import it in Vercel → it will auto-detect Next.js.
3. Add `NASA_API_KEY` and `LAUNCH_LIBRARY_API_KEY` under Project → Settings →
   Environment Variables if you have them (optional).
4. Deploy. No build command changes are needed.

## 7. Extending COSMOS

- **More sources**: ESA, SpaceX, Blue Origin, Roscosmos each publish their own
  RSS/API — add a `src/lib/<agency>.ts` following the same shape as `nasa.ts`
  and merge it into `src/lib/news.ts`.
- **Durable cache**: `src/lib/cache.ts` is in-process memory, which is fine for
  a single long-lived server but resets on cold starts in serverless. Swap it
  for Vercel KV / Upstash Redis using the same `get`/`set` shape.
- **Push notifications** for launch T‑minus milestones, via the existing service
  worker.
- **Astronaut / expedition data** — Launch Library 2 also exposes `/astronaut/`
  and `/expedition/` endpoints that pair naturally with the ISS mission page.
- **Localization** — the UI copy is currently English-only; category/agency
  labels are short enough to translate directly.

## 8. Attribution & policies

- NASA content is generally not copyrighted in the United States; see NASA's
  media usage guidelines for exceptions (e.g. contractor imagery).
- JAXA press materials remain subject to JAXA's own site policy — COSMOS only
  shows short summaries and always links to the original release.
- Launch data is provided by **The Space Devs — Launch Library 2**
  (thespacedevs.com), shown with attribution on the Upcoming pages as their
  terms require.
- COSMOS is an independent, unofficial project — not produced or endorsed by
  NASA or JAXA.
