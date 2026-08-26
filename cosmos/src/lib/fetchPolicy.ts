/**
 * Central caching policy for every outbound fetch in the data layer.
 *
 * - Production: Next.js `fetch` revalidation, so we don't hammer NASA/JAXA's
 *   free public feeds and APIs (see brief section 15 on caching politeness).
 * - Development: cache is bypassed entirely (`no-store`) so a developer
 *   debugging "why is X not showing" always sees a truly live fetch rather
 *   than a stale cached response from ten minutes ago.
 *
 * Set `COSMOS_FORCE_LIVE=1` to force live fetches even in production (useful
 * for the health-check endpoint / manual debugging against a deployed app).
 */
export function fetchCache(revalidateSeconds: number): RequestInit & { next?: { revalidate?: number } } {
  const forceLive = process.env.COSMOS_FORCE_LIVE === "1";
  if (process.env.NODE_ENV !== "production" || forceLive) {
    return { cache: "no-store" };
  }
  return { next: { revalidate: revalidateSeconds } };
}
