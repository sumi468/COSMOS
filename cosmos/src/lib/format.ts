import { DEFAULT_LOCALE, type Locale } from "@/lib/language";
import { messages } from "@/lib/messages";

// Formatting helpers. All dates are kept as ISO strings from their source
// feed/API and only formatted for display here — never invented.

export function relativeTime(iso: string, locale: Locale = DEFAULT_LOCALE, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = now.getTime() - then;
  const diffSec = Math.round(diffMs / 1000);

  const { time } = messages[locale];
  if (diffSec < 60) return time.justNow;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return time.minutesAgo(diffMin);
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return time.hoursAgo(diffHr);
  const diffDay = Math.round(diffHr / 24);
  if (diffDay === 1) return time.yesterday;
  if (diffDay < 7) return time.daysAgo(diffDay);
  return formatLocalDate(iso, locale);
}

export function updatedLabel(iso: string, locale: Locale = DEFAULT_LOCALE, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  const { time } = messages[locale];
  if (diffMin < 1) return time.updatedNow;
  if (diffMin < 60) return time.updatedMinutes(diffMin);
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return time.updatedHours(diffHr);
  return time.updatedToday;
}

export function formatLocalDateTime(iso: string, locale: Locale = DEFAULT_LOCALE): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });
}

export function formatLocalDate(iso: string, locale: Locale = DEFAULT_LOCALE): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

const japaneseLaunchStatuses = new Map([
  ["TBD", "未定"],
  ["To Be Determined", "未定"],
  ["To Be Confirmed", "確認待ち"],
  ["Go for Launch", "打ち上げ予定"],
  ["Hold", "一時保留"],
  ["Launch in Flight", "飛行中"],
  ["Launch Successful", "打ち上げ成功"],
  ["Launch Failure", "打ち上げ失敗"],
  ["Launch Was a Partial Failure", "打ち上げは一部失敗"]
]);

export function launchStatusLabel(status: string, locale: Locale): string {
  return locale === "ja" ? japaneseLaunchStatuses.get(status) ?? status : status;
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
