import type { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return <div className="page-shell max-w-shell mx-auto px-5 md:px-8 py-8 md:py-10">{children}</div>;
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
