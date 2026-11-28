import Link from "next/link";
import { getLocalization } from "@/lib/localization";
import { localizeMission, type MissionProfile } from "@/lib/missions";
import type { Mission } from "@/types/cosmos";

const STATUS_STYLES: Record<Mission["status"], string> = {
  Active: "text-cosmos-teal border-cosmos-teal/30 bg-cosmos-teal/[0.08]",
  Upcoming: "text-cosmos-accent border-cosmos-accent/30 bg-cosmos-accent/[0.08]",
  Extended: "text-cosmos-warning border-cosmos-warning/30 bg-cosmos-warning/[0.08]",
  Completed: "text-cosmos-muted border-cosmos-line bg-cosmos-inset"
};

export default function MissionCard({ mission }: { mission: MissionProfile }) {
  const { locale, copy } = getLocalization();
  const { name, description, target } = localizeMission(mission, locale);

  return (
    <Link
      href={`/missions/${mission.slug}`}
      className="motion-card mission-card group flex flex-col justify-between gap-4 rounded-2xl border border-cosmos-line p-5 sm:p-6"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="eyebrow text-cosmos-muted">{copy.agency[mission.organization]}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[mission.status]}`}>
            {copy.missionStatus[mission.status]}
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-medium leading-snug text-cosmos-ink group-hover:text-cosmos-accent transition-colors">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-cosmos-muted line-clamp-3">{description}</p>
      </div>
      {target && (
        <p className="border-t border-cosmos-line pt-3 text-xs text-cosmos-muted">
          {copy.common.target} &middot; <span className="text-cosmos-ink">{target}</span>
        </p>
      )}
    </Link>
  );
}
