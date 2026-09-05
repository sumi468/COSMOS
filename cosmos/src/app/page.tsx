import Link from "next/link";
import PageShell, { SectionHeading } from "@/components/PageShell";
import FeaturedNews from "@/components/FeaturedNews";
import NewsCard from "@/components/NewsCard";
import EventCard from "@/components/EventCard";
import MissionCard from "@/components/MissionCard";
import UpdatedBadge from "@/components/UpdatedBadge";
import { SourceErrorNotice, EmptyState } from "@/components/EmptyState";
import { getAllNews } from "@/lib/news";
import { getUpcomingEvents, LAUNCH_LIBRARY_ATTRIBUTION } from "@/lib/launches";
import { MISSIONS } from "@/lib/missions";

export const revalidate = 300;

export default async function HomePage() {
  const [news, events] = await Promise.all([getAllNews(), getUpcomingEvents()]);

  const featured = news.items.slice(0, 3);
  const latest = news.items.slice(3, 9);
  const upcoming = events.items.slice(0, 3);
  const spotlightMissions = MISSIONS.filter((m) => m.status === "Active" || m.status === "Upcoming").slice(0, 4);

  return (
    <PageShell>
      <header className="mb-10">
        <p className="eyebrow text-cosmos-cyan">Live / Latest</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl leading-[1.05] text-white">COSMOS</h1>
        <p className="mt-2 text-cosmos-muted max-w-md">Explore what&rsquo;s happening beyond Earth.</p>
        <div className="mt-4">
          <UpdatedBadge updatedAt={news.updatedAt} stale={news.stale} />
        </div>
      </header>

      <SourceErrorNotice errors={news.errors} />

      <section className="mt-8">
        <SectionHeading eyebrow="Featured" />
        {featured.length > 0 ? (
          <FeaturedNews items={featured} />
        ) : (
          <EmptyState
            title="NASAとJAXAの最新情報を取得できませんでした"
            message="Official feeds are temporarily unreachable. Please check back shortly."
          />
        )}
      </section>

      <section className="mt-12">
        <SectionHeading eyebrow="Latest" title="From NASA & JAXA" action={<Link href="/latest" className="text-sm text-cosmos-ice hover:underline">View all &rarr;</Link>} />
        {latest.length > 0 ? (
          <div>
            {latest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState title="No additional stories right now" />
        )}
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Upcoming"
          title="What's next"
          action={<Link href="/upcoming" className="text-sm text-cosmos-ice hover:underline">Full schedule &rarr;</Link>}
        />
        {upcoming.length > 0 ? (
          <div className="grid gap-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="今後のイベントを取得できませんでした"
            message="No confirmed NASA or JAXA launches found in the current window."
          />
        )}
        <p className="mt-3 text-xs text-cosmos-muted/60">{LAUNCH_LIBRARY_ATTRIBUTION}</p>
      </section>

      <section className="mt-12 mb-4">
        <SectionHeading
          eyebrow="Missions"
          title="In focus"
          action={<Link href="/missions" className="text-sm text-cosmos-ice hover:underline">All missions &rarr;</Link>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spotlightMissions.map((mission) => (
            <MissionCard key={mission.slug} mission={mission} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
