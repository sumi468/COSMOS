import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getLocalization } from "@/lib/localization";

export default function NotFound() {
  const { copy } = getLocalization();

  return (
    <PageShell>
      <h1 className="font-display text-2xl text-white">{copy.notFound.title}</h1>
      <Link href="/" className="mt-4 inline-block text-sm text-cosmos-ice hover:underline">
        &larr; {copy.notFound.home}
      </Link>
    </PageShell>
  );
}
