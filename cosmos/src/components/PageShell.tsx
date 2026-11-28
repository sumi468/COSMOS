import type { ReactNode } from "react";
import MotionSurface from "@/components/MotionSurface";

export default function PageShell({ children }: { children: ReactNode }) {
  return <MotionSurface>{children}</MotionSurface>;
}

export function SectionHeading({
  as: Heading = "h2",
  eyebrow,
  title,
  action
}: {
  as?: "h1" | "h2";
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow text-cosmos-accent">{eyebrow}</p>}
        <Heading className="editorial-title">{title}</Heading>
      </div>
      {action}
    </header>
  );
}
