import PageShell, { SectionHeading } from "@/components/PageShell";
import MissionCard from "@/components/MissionCard";
import { MISSIONS } from "@/lib/missions";
import { getLocalization } from "@/lib/localization";

export function generateMetadata() {
  return { title: getLocalization().copy.nav.missions };
}

export default function MissionsPage() {
  const { copy } = getLocalization();

  return (
    <PageShell>
      <SectionHeading eyebrow={copy.nav.missions} title={copy.missions.title} />
      <p className="text-sm text-cosmos-muted max-w-lg mb-8">
        {copy.missions.description}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((mission) => (
          <MissionCard key={mission.slug} mission={mission} />
        ))}
      </div>
    </PageShell>
  );
}
