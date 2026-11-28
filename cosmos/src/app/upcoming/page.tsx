import { Suspense } from "react";
import LoadingState from "@/components/LoadingState";
import PageShell, { SectionHeading } from "@/components/PageShell";
import EventCard from "@/components/EventCard";
import UpdatedBadge from "@/components/UpdatedBadge";
import { SourceErrorNotice, EmptyState } from "@/components/EmptyState";
import { getUpcomingEvents } from "@/lib/launches";
import { getLocalization } from "@/lib/localization";

export const revalidate = 900;
export function generateMetadata() {
  return { title: getLocalization().copy.nav.upcoming };
}

export default function UpcomingPage() {
  const { copy } = getLocalization();

  return (
    <PageShell>
      <Suspense fallback={
        <>
          <SectionHeading as="h1" eyebrow={copy.nav.upcoming} title={copy.upcoming.title} />
          <LoadingState compact />
        </>
      }>
        <UpcomingSchedule />
      </Suspense>
    </PageShell>
  );
}

async function UpcomingSchedule() {
  const { copy } = getLocalization();
  const events = await getUpcomingEvents();

  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow={copy.nav.upcoming}
        title={copy.upcoming.title}
        action={<UpdatedBadge updatedAt={events.updatedAt} stale={events.stale} />}
      />
      <SourceErrorNotice errors={events.errors} />

      {events.items.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {events.items.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title={copy.upcoming.noLaunches}
            message={copy.upcoming.checkSchedules}
          />
        </div>
      )}
      <p className="mt-4 text-xs text-cosmos-muted">{copy.upcoming.attribution} {copy.upcoming.localDates}</p>
    </>
  );
}
