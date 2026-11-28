import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import CountdownTicker from "@/components/CountdownTicker";
import { formatLocalDateTime, launchStatusLabel } from "@/lib/format";
import { getLocalization } from "@/lib/localization";
import { getUpcomingEventById } from "@/lib/launches";

export const revalidate = 900;

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getUpcomingEventById(params.id);
  if (!event) notFound();

  const { locale, copy } = getLocalization();

  return (
    <PageShell>
      <Link href="/upcoming" className="text-sm text-cosmos-muted hover:text-cosmos-ink">&larr; {copy.event.back}</Link>

      <div className="mt-6 max-w-2xl">
        <div className="eyebrow text-cosmos-accent">{copy.event.label}</div>
        <h1 className="mt-2.5 editorial-title article-title">{event.title}</h1>

        {event.imageUrl && (
          <div className="relative mt-6 aspect-video rounded-2xl overflow-hidden border border-cosmos-line">
            <Image src={event.imageUrl} alt="" fill sizes="700px" className="object-cover" />
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-cosmos-line bg-cosmos-surface p-5 sm:p-6">
          <p className="eyebrow text-cosmos-muted">{copy.event.countdown}</p>
          <div className="mt-2">
            <CountdownTicker netDate={event.netDate} />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-cosmos-line bg-cosmos-surface p-5 text-sm sm:p-6">
          <div>
            <dt className="eyebrow text-cosmos-muted">{copy.event.localDate}</dt>
            <dd className="mt-1 text-cosmos-ink">{formatLocalDateTime(event.netDate, locale)}</dd>
          </div>
          <div>
            <dt className="eyebrow text-cosmos-muted">{copy.common.organization}</dt>
            <dd className="mt-1 text-cosmos-ink">{copy.agency[event.agency]}</dd>
          </div>
          <div>
            <dt className="eyebrow text-cosmos-muted">{copy.event.kind}</dt>
            <dd className="mt-1 text-cosmos-ink">{copy.eventKind[event.kind]}</dd>
          </div>
          <div>
            <dt className="eyebrow text-cosmos-muted">{copy.common.status}</dt>
            <dd className="mt-1 text-cosmos-ink">{launchStatusLabel(event.status, locale)}</dd>
          </div>
          {event.location && (
            <div className="col-span-2">
              <dt className="eyebrow text-cosmos-muted">{copy.event.location}</dt>
              <dd className="mt-1 text-cosmos-ink">{event.location}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 border-t border-cosmos-line pt-6">
          <p className="eyebrow text-cosmos-muted mb-2">{copy.event.description}</p>
          <p className="text-[15px] leading-relaxed text-cosmos-ink/90">{event.description}</p>
        </div>

        <div className="mt-6">
          <p className="eyebrow text-cosmos-muted mb-1">{copy.event.source}</p>
          <p className="text-xs text-cosmos-muted mb-3">{copy.upcoming.attribution}</p>
          <a
            href={event.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-button"
          >
            {copy.event.details} &rarr;
          </a>
        </div>
      </div>
    </PageShell>
  );
}
