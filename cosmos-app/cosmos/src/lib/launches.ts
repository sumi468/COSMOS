import { encodeId } from "@/lib/id";
import { getLastGood, setLastGood } from "@/lib/cache";
import type { Agency, EventKind, FetchResult, UpcomingEvent } from "@/types/cosmos";

// Launch Library 2 (https://ll.thespacedevs.com) is a free, key-free,
// community-maintained public database of rocket launches and space
// events, used by most launch-tracking apps. We use the production
// endpoint (ll.thespacedevs.com), which is rate-limited but doesn't
// require registration; set LAUNCH_LIBRARY_API_KEY server-side to raise
// the limit if you register with The Space Devs.
const BASE_URL = "https://ll.thespacedevs.com/2.2.0";
const CACHE_KEY = "upcoming-events";
const REVALIDATE_SECONDS = 1800; // launch schedules move slowly; be polite to a free API

function mapAgency(name: string): Agency | "International" | "Commercial" {
  const n = name.toLowerCase();
  if (n.includes("nasa")) return "NASA";
  if (n.includes("jaxa")) return "JAXA";
  return "Commercial";
}

function kindFromName(name: string, missionType?: string): EventKind {
  const text = `${name} ${missionType ?? ""}`.toLowerCase();
  if (text.includes("spacewalk") || text.includes("eva")) return "Spacewalk";
  if (text.includes("dock")) return "Docking";
  if (text.includes("flyby")) return "Flyby";
  if (text.includes("land")) return "Landing";
  return "Launch";
}

async function fetchLaunches(agencySearch: string): Promise<any[]> {
  const key = process.env.LAUNCH_LIBRARY_API_KEY;
  const headers: Record<string, string> = {};
  if (key) headers.Authorization = `Token ${key}`;
  const url = `${BASE_URL}/launch/upcoming/?search=${encodeURIComponent(agencySearch)}&limit=15&mode=normal`;
  const res = await fetch(url, { headers, next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Launch Library responded ${res.status}`);
  const data = await res.json();
  return data?.results ?? [];
}

export async function getUpcomingEvents(): Promise<FetchResult<UpcomingEvent>> {
  const errors: string[] = [];
  const collected: UpcomingEvent[] = [];
  const seenIds = new Set<string>();

  await Promise.all(
    ["NASA", "JAXA"].map(async (agencyQuery) => {
      try {
        const launches = await fetchLaunches(agencyQuery);
        for (const launch of launches) {
          if (seenIds.has(launch.id)) continue;
          const providerName: string = launch.launch_service_provider?.name ?? agencyQuery;
          const agency = mapAgency(providerName);
          // Keep only launches actually tied to NASA or JAXA, since the
          // text search can surface unrelated commercial launches too.
          if (agency !== "NASA" && agency !== "JAXA") continue;
          seenIds.add(launch.id);
          const net: string = launch.net ?? launch.window_start;
          if (!net) continue;
          collected.push({
            id: encodeId(launch.id ?? launch.slug ?? launch.name),
            title: launch.name ?? "Untitled launch",
            agency,
            kind: kindFromName(launch.name ?? "", launch.mission?.type),
            netDate: new Date(net).toISOString(),
            status: launch.status?.name ?? "TBD",
            description:
              launch.mission?.description ??
              `${launch.rocket?.configuration?.full_name ?? "Rocket"} launch from ${launch.pad?.name ?? "an undisclosed pad"}.`,
            officialUrl: launch.slug
              ? `https://thespacedevs.com/launch/${launch.slug}`
              : "https://ll.thespacedevs.com",
            imageUrl: launch.image,
            location: [launch.pad?.name, launch.pad?.location?.name].filter(Boolean).join(", ")
          });
        }
      } catch (err) {
        errors.push(`${agencyQuery}の今後のイベントを取得できませんでした`);
      }
    })
  );

  collected.sort((a, b) => new Date(a.netDate).getTime() - new Date(b.netDate).getTime());

  if (collected.length > 0) {
    setLastGood(CACHE_KEY, collected);
    return { items: collected, updatedAt: new Date().toISOString(), stale: false, errors };
  }
  const fallback = getLastGood<UpcomingEvent[]>(CACHE_KEY);
  if (fallback) {
    return { items: fallback.value, updatedAt: fallback.updatedAt, stale: true, errors };
  }
  return { items: [], updatedAt: new Date().toISOString(), stale: false, errors };
}

export async function getUpcomingEventById(id: string): Promise<UpcomingEvent | null> {
  const { items } = await getUpcomingEvents();
  return items.find((e) => e.id === id) ?? null;
}

// Attribution required by The Space Devs for derived data.
export const LAUNCH_LIBRARY_ATTRIBUTION = "Launch data: The Space Devs — Launch Library 2 (thespacedevs.com)";
