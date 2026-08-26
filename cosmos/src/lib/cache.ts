// Very small "last known good" cache. If a live fetch to NASA/JAXA fails,
// we fall back to the last successful payload instead of showing an empty
// screen (see brief section 16). This is process-memory only: fine for a
// single long-lived Node server or local dev. For a serverless/edge
// deployment with many cold instances, swap this for a durable KV store
// (Vercel KV, Upstash Redis, etc.) — the get/set shape below is designed
// to be a drop-in replacement.

interface Entry<T> {
  value: T;
  updatedAt: string;
}

const store = new Map<string, Entry<unknown>>();

export function getLastGood<T>(key: string): Entry<T> | undefined {
  return store.get(key) as Entry<T> | undefined;
}

export function setLastGood<T>(key: string, value: T): Entry<T> {
  const entry = { value, updatedAt: new Date().toISOString() };
  store.set(key, entry);
  return entry;
}
