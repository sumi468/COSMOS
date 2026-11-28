import { Suspense } from "react";
import Link from "next/link";
import PageShell, { SectionHeading } from "@/components/PageShell";
import FeaturedNews from "@/components/FeaturedNews";
import NewsCard from "@/components/NewsCard";
import EventCard from "@/components/EventCard";
import MissionCard from "@/components/MissionCard";
import UpdatedBadge from "@/components/UpdatedBadge";
import SpaceHero from "@/components/SpaceHero";
import LoadingState from "@/components/LoadingState";
import { SourceErrorNotice, EmptyState } from "@/components/EmptyState";
import { getAllNews } from "@/lib/news";
import { getUpcomingEvents } from "@/lib/launches";
import { MISSIONS } from "@/lib/missions";
import { getLocalization } from "@/lib/localization";

export const revalidate = 300;

export default function HomePage() {
  const { copy } = getLocalization();
  const spotlightMissions = MISSIONS.filter((m) => m.status === "Active" || m.status === "Upcoming").slice(0, 4);

  return (
    <PageShell>
      <SpaceHero />

      <div id="dispatches">
        <Suspense fallback={<HomeSectionLoading eyebrow={copy.home.dispatches} title={copy.home.stories} />}>
          <HomeNews />
        </Suspense>
      </div>

      <section className="mt-12">
        <Suspense fallback={<HomeSectionLoading eyebrow={copy.nav.upcoming} title={copy.home.whatsNext} />}>
          <HomeSchedule />
        </Suspense>
      </section>

      <section className="mt-12 mb-4">
        <SectionHeading
          eyebrow={copy.nav.missions}
          title={copy.home.inFocus}
          action={<Link href="/missions" className="text-sm text-cosmos-accent hover:underline">{copy.home.allMissions} &rarr;</Link>}
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

function HomeSectionLoading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <LoadingState compact />
    </>
  );
}

async function HomeNews() {
  const { copy } = getLocalization();
  const news = await getAllNews();
  const featured = news.items.slice(0, 3);
  const latest = news.items.slice(3, 9);

  return (
    <>
      <section>
        <SectionHeading
          eyebrow={copy.home.dispatches}
          title={copy.home.stories}
          action={<UpdatedBadge updatedAt={news.updatedAt} stale={news.stale} />}
        />
        <SourceErrorNotice errors={news.errors} />
        {featured.length > 0 ? (
          <FeaturedNews items={featured} />
        ) : (
          <EmptyState title={copy.home.feedsUnavailable} message={copy.home.checkBack} />
        )}
      </section>

      <section className="mt-12">
        <SectionHeading eyebrow={copy.nav.latest} title={copy.home.fromAgencies} action={<Link href="/latest" className="text-sm text-cosmos-accent hover:underline">{copy.home.viewAll} &rarr;</Link>} />
        {latest.length > 0 ? (
          <div>
            {latest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState title={copy.home.noMoreStories} />
        )}
      </section>
    </>
  );
}

async function HomeSchedule() {
  const { copy } = getLocalization();
  const events = await getUpcomingEvents();
  const upcoming = events.items.slice(0, 3);

  return (
    <>
      <SectionHeading
        eyebrow={copy.nav.upcoming}
        title={copy.home.whatsNext}
        action={<Link href="/upcoming" className="text-sm text-cosmos-accent hover:underline">{copy.home.fullSchedule} &rarr;</Link>}
      />
      {upcoming.length > 0 ? (
        <div className="grid gap-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState title={copy.home.eventsUnavailable} message={copy.home.noLaunchesInWindow} />
      )}
      <p className="mt-3 text-xs text-cosmos-muted">{copy.upcoming.attribution}</p>
    </>
  );
}
