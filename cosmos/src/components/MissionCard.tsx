import Link from "next/link";
import type { Mission } from "@/types/cosmos";

const STATUS_STYLES: Record<Mission["status"], string> = {
  Active: "text-cosmos-cyan border-cosmos-cyan/30 bg-cosmos-cyan/[0.08]",
  Upcoming: "text-cosmos-ice border-cosmos-ice/30 bg-cosmos-ice/[0.08]",
  Extended: "text-cosmos-amber border-cosmos-amber/30 bg-cosmos-amber/[0.08]",
  Completed: "text-cosmos-muted border-cosmos-line bg-white/[0.03]"
};

export default function MissionCard({ mission }: { mission: Mission }) {
  return (
    <Link
      href={`/missions/${mission.slug}`}
      className="group flex flex-col justify-between gap-4 rounded-2xl border border-cosmos-line p-5 hover:border-cosmos-ice/30 transition-colors"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow text-cosmos-muted">{mission.organization}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[mission.status]}`}>
            {mission.status}
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg text-white group-hover:text-cosmos-ice transition-colors">
          {mission.name}
        </h3>
        <p className="mt-1.5 text-sm text-cosmos-muted line-clamp-3">{mission.description}</p>
      </div>
      {mission.target && (
        <p className="text-xs text-cosmos-muted/70">
          Target &middot; <span className="text-cosmos-muted">{mission.target}</span>
        </p>
      )}
    </Link>
  );
}
