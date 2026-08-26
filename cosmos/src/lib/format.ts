// Formatting helpers. All dates are kept as ISO strings from their source
// feed/API and only formatted for display here — never invented.

export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = now.getTime() - then;
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function updatedLabel(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Updated just now";
  if (diffMin < 60) return `Updated ${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `Updated ${diffHr}h ago`;
  return "Updated today";
}

export function formatLocalDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });
}

export function formatLocalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export interface Countdown {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function countdownTo(iso: string, now: Date = new Date()): Countdown {
  const target = new Date(iso).getTime();
  const totalMs = target - now.getTime();
  const isPast = totalMs <= 0;
  const abs = Math.abs(totalMs);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  const minutes = Math.floor((abs % 3600000) / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  return { totalMs, days, hours, minutes, seconds, isPast };
}

export function countdownLabel(iso: string, now: Date = new Date()): string {
  const c = countdownTo(iso, now);
  if (c.isPast) return "In progress / passed";
  if (c.days > 0) return `T\u2212${c.days}D ${c.hours}H`;
  if (c.hours > 0) return `T\u2212${c.hours}H ${c.minutes}M`;
  return `T\u2212${c.minutes}M`;
}
