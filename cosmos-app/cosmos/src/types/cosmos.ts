// Shared domain types for COSMOS. Every NewsItem / SpaceImage / LaunchEvent
// must be traceable to a real, fetched source — never fabricated.

export type Agency = "NASA" | "JAXA";

export type NewsCategory =
  | "Launch"
  | "Mission"
  | "Science"
  | "ISS"
  | "Space Telescope"
  | "Earth"
  | "Moon"
  | "Mars"
  | "Astronomy"
  | "Aeronautics"
  | "General";

export interface NewsItem {
  id: string; // base64url of officialUrl, stable + reversible
  source: Agency;
  title: string;
  summary: string;
  publishedAt: string; // ISO 8601, from the feed — never guessed
  officialUrl: string;
  category: NewsCategory;
  imageUrl?: string;
  feedName: string; // which feed this came from, for transparency
}

export interface SpaceImage {
  id: string;
  title: string;
  date: string; // ISO date as published by NASA
  explanation: string;
  imageUrl: string;
  hdImageUrl?: string;
  credit: string;
  source: "NASA APOD" | "NASA Image and Video Library";
  officialUrl: string;
  mediaType: "image" | "video";
}

export type MissionStatus = "Upcoming" | "Active" | "Extended" | "Completed";

export interface Mission {
  slug: string;
  name: string;
  organization: Agency | "International";
  description: string;
  status: MissionStatus;
  target?: string;
  launchDate?: string; // ISO date, only when publicly confirmed
  officialUrl: string;
  imageUrl?: string;
  latestUpdateNote?: string;
}

export type EventKind = "Launch" | "Spacewalk" | "Docking" | "Flyby" | "Landing" | "Milestone";

export interface UpcomingEvent {
  id: string;
  title: string;
  agency: Agency | "International" | "Commercial";
  kind: EventKind;
  netDate: string; // ISO 8601 "No Earlier Than" date/time, UTC
  status: string; // e.g. "Go", "TBD", "Hold"
  description: string;
  officialUrl: string;
  imageUrl?: string;
  location?: string;
}

export interface FetchResult<T> {
  items: T[];
  updatedAt: string; // ISO timestamp of this successful fetch
  stale: boolean; // true if served from last-known-good cache after a failure
  errors: string[]; // human-readable, per-source fetch problems (non-fatal)
}
