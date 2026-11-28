import CosmosMark from "@/components/CosmosMark";
import { getLocalization } from "@/lib/localization";

export default function LoadingState({ compact = false }: { compact?: boolean }) {
  const { copy } = getLocalization();

  return (
    <div className={`cosmos-loading${compact ? " cosmos-loading-compact" : ""}`} role="status">
      <span className="loading-orbit" aria-hidden="true"><CosmosMark /></span>
      {!compact && <span className="cosmos-wordmark" aria-hidden="true">COSMOS</span>}
      <span className="loading-caption">{copy.common.loading}</span>
    </div>
  );
}
