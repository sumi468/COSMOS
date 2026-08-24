import Link from "next/link";
import CountdownTicker from "@/components/CountdownTicker";
import { formatLocalDate } from "@/lib/format";
import type { UpcomingEvent } from "@/types/cosmos";

export default function EventCard({ event }: { event: UpcomingEvent }) {
  const d = new Date(event.netDate);
  const month = d.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
  const day = d.getDate();

  return (
    <Link
      href={`/upcoming/${event.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-cosmos-line p-4 hover:border-cosmos-ice/30 transition-colors"
    >
      <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 rounded-xl bg-cosmos-panel2 border border-cosmos-line">
        <span className="eyebrow text-cosmos-muted">{month}</span>
        <span className="font-display text-lg text-white leading-none mt-0.5">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 eyebrow text-cosmos-ice/80">
          <span>{event.agency}</span>
          <span className="text-cosmos-muted/60">&middot;</span>
          <span className="text-cosmos-muted">{event.kind}</span>
        </div>
        <h3 className="mt-1 font-display text-[15px] text-white group-hover:text-cosmos-ice transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-1 text-xs text-cosmos-muted">{formatLocalDate(event.netDate)} &middot; {event.status}</p>
      </div>
      <div className="shrink-0 text-right hidden sm:block">
        <CountdownTicker netDate={event.netDate} compact />
      </div>
    </Link>
  );
}
