import type { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return <div className="max-w-shell mx-auto px-5 md:px-8 py-8 md:py-12">{children}</div>;
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
    <div className="flex items-end justify-between mb-4">
      <div>
        <p className="eyebrow text-cosmos-muted">{eyebrow}</p>
        {title && <h2 className="font-display text-xl text-white mt-1">{title}</h2>}
      </div>
      {action}
    </div>
  );
}
