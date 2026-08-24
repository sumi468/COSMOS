import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import CountdownTicker from "@/components/CountdownTicker";
import { formatLocalDateTime } from "@/lib/format";
import { getUpcomingEventById, LAUNCH_LIBRARY_ATTRIBUTION } from "@/lib/launches";

export const revalidate = 900;

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getUpcomingEventById(params.id);
  if (!event) notFound();

  return (
    <PageShell>
      <Link href="/upcoming" className="text-sm text-cosmos-muted hover:text-white">&larr; Back to Upcoming</Link>

      <div className="mt-6 max-w-2xl">
        <div className="eyebrow text-cosmos-ice">Event</div>
        <h1 className="mt-2 font-display text-2xl md:text-3xl text-white">{event.title}</h1>

        {event.imageUrl && (
          <div className="relative mt-6 aspect-video rounded-2xl overflow-hidden border border-cosmos-line">
            <Image src={event.imageUrl} alt="" fill sizes="700px" className="object-cover" />
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-cosmos-line p-6">
          <p className="eyebrow text-cosmos-muted">Countdown</p>
          <div className="mt-2">
            <CountdownTicker netDate={event.netDate} />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-cosmos-line p-5 text-sm">
          <div>
            <dt className="eyebrow text-cosmos-muted">Date (local)</dt>
            <dd className="mt-1 text-white">{formatLocalDateTime(event.netDate)}</dd>
          </div>
          <div>
            <dt className="eyebrow text-cosmos-muted">Organization</dt>
            <dd className="mt-1 text-white">{event.agency}</dd>
          </div>
          <div>
            <dt className="eyebrow text-cosmos-muted">Type</dt>
            <dd className="mt-1 text-white">{event.kind}</dd>
          </div>
          <div>
            <dt className="eyebrow text-cosmos-muted">Status</dt>
            <dd className="mt-1 text-white">{event.status}</dd>
          </div>
          {event.location && (
            <div className="col-span-2">
              <dt className="eyebrow text-cosmos-muted">Location</dt>
              <dd className="mt-1 text-white">{event.location}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 border-t border-cosmos-line pt-6">
          <p className="eyebrow text-cosmos-muted mb-2">Description</p>
          <p className="text-[15px] leading-relaxed text-cosmos-white/90">{event.description}</p>
        </div>

        <div className="mt-6">
          <p className="eyebrow text-cosmos-muted mb-1">Source</p>
          <p className="text-xs text-cosmos-muted mb-3">{LAUNCH_LIBRARY_ATTRIBUTION}</p>
          <a
            href={event.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cosmos-ice text-cosmos-black text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
          >
            View launch details &rarr;
          </a>
        </div>
      </div>
    </PageShell>
  );
}
