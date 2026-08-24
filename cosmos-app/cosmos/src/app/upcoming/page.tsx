import PageShell, { SectionHeading } from "@/components/PageShell";
import EventCard from "@/components/EventCard";
import UpdatedBadge from "@/components/UpdatedBadge";
import { SourceErrorNotice, EmptyState } from "@/components/EmptyState";
import { getUpcomingEvents, LAUNCH_LIBRARY_ATTRIBUTION } from "@/lib/launches";

export const revalidate = 900;
export const metadata = { title: "Upcoming" };

export default async function UpcomingPage() {
  const events = await getUpcomingEvents();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Upcoming"
        title="What's next in space"
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
            title="No confirmed NASA or JAXA launches found"
            message="Check back soon, or visit the official launch schedules directly."
          />
        </div>
      )}
      <p className="mt-4 text-xs text-cosmos-muted/60">{LAUNCH_LIBRARY_ATTRIBUTION}. Dates are shown in your local time.</p>
    </PageShell>
  );
}
