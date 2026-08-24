import PageShell, { SectionHeading } from "@/components/PageShell";
import MissionCard from "@/components/MissionCard";
import { MISSIONS } from "@/lib/missions";

export const metadata = { title: "Missions" };

export default function MissionsPage() {
  return (
    <PageShell>
      <SectionHeading eyebrow="Missions" title="Active & upcoming" />
      <p className="text-sm text-cosmos-muted max-w-lg mb-8">
        Reference profiles for real, publicly documented NASA and JAXA missions. Each links to the
        agency&rsquo;s own mission page for the latest status.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((mission) => (
          <MissionCard key={mission.slug} mission={mission} />
        ))}
      </div>
    </PageShell>
  );
}
