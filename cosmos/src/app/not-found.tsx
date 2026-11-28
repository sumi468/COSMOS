import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getLocalization } from "@/lib/localization";

export default function NotFound() {
  const { copy } = getLocalization();

  return (
    <PageShell>
      <h1 className="editorial-title article-title">{copy.notFound.title}</h1>
      <Link href="/" className="mt-4 inline-block text-sm text-cosmos-accent hover:underline">
        &larr; {copy.notFound.home}
      </Link>
    </PageShell>
  );
}
