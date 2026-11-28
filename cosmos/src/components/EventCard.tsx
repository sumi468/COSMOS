import Link from "next/link";
import CountdownTicker from "@/components/CountdownTicker";
import { formatLocalDate, launchStatusLabel } from "@/lib/format";
import { getLocalization } from "@/lib/localization";
import type { UpcomingEvent } from "@/types/cosmos";

export default function EventCard({ event }: { event: UpcomingEvent }) {
  const { locale, copy } = getLocalization();
  const d = new Date(event.netDate);
  const month = d.toLocaleDateString(locale, { month: "short" }).toUpperCase();
  const day = d.getDate();

  return (
    <Link
      href={`/upcoming/${event.id}`}
      className="motion-card event-card group flex items-center gap-4 rounded-2xl border border-cosmos-line p-3 sm:p-4"
    >
      <div className="flex w-14 h-14 shrink-0 flex-col items-center justify-center rounded-xl bg-cosmos-inset">
        <span className="eyebrow text-cosmos-muted">{month}</span>
        <span className="editorial-title text-[1.65rem] mt-0.5">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 eyebrow text-cosmos-accent">
          <span>{copy.agency[event.agency]}</span>
          <span className="text-cosmos-muted">&middot;</span>
          <span className="text-cosmos-muted">{copy.eventKind[event.kind]}</span>
        </div>
        <h3 className="mt-1 font-display text-base font-medium leading-snug text-cosmos-ink group-hover:text-cosmos-accent transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-1 text-xs text-cosmos-muted">{formatLocalDate(event.netDate, locale)} &middot; {launchStatusLabel(event.status, locale)}</p>
      </div>
      <div className="shrink-0 text-right hidden sm:block">
        <CountdownTicker netDate={event.netDate} compact />
      </div>
    </Link>
  );
}
