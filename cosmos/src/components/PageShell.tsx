import type { ReactNode } from "react";
import MotionSurface from "@/components/MotionSurface";

export default function PageShell({ children }: { children: ReactNode }) {
  return <MotionSurface>{children}</MotionSurface>;
}

export function SectionHeading({
  eyebrow,
  title,
  action
}: {
  eyebrow: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading flex items-end justify-between gap-4 mb-5">
      <div>
        <p className="eyebrow text-cosmos-muted">{eyebrow}</p>
        {title && <h2 className="font-display text-xl text-white mt-1">{title}</h2>}
      </div>
      {action}
    </div>
  );
}
