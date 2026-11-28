import { Suspense } from "react";
import PageShell, { SectionHeading } from "@/components/PageShell";
import SpaceImageCard from "@/components/SpaceImageCard";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { getApod, searchNasaImages } from "@/lib/nasa";
import { getLocalization } from "@/lib/localization";

export const revalidate = 3600;
export function generateMetadata() {
  return { title: getLocalization().copy.images.title };
}

export default function ImagesPage({ searchParams }: { searchParams: { q?: string } }) {
  const { copy } = getLocalization();
  const query = searchParams.q?.trim();

  return (
    <PageShell>
      <SectionHeading as="h1" title={copy.images.title} />
      <div className="grid gap-9">
        <Suspense fallback={<LoadingState compact />}>
          <AstronomyPhoto />
        </Suspense>
        <section>
          <SectionHeading title={copy.images.library} />
          <div className="mb-6">
            <SearchBar action="/images" defaultValue={query} />
          </div>
          <Suspense key={query ?? ""} fallback={<LoadingState compact />}>
            <GalleryResults query={query} />
          </Suspense>
        </section>
      </div>
    </PageShell>
  );
}

async function AstronomyPhoto() {
  const { copy } = getLocalization();
  const { image, stale } = await getApod();

  if (!image) return <p className="text-sm text-cosmos-muted">{copy.images.apodUnavailable}</p>;

  return (
    <section>
      <h2 className="eyebrow mb-3 text-cosmos-accent">{copy.images.pictureOfDay}</h2>
      {stale && <p className="mb-4 text-sm text-cosmos-warning">{copy.images.savedImage}</p>}
      <SpaceImageCard image={image} featured />
    </section>
  );
}

async function GalleryResults({ query }: { query?: string }) {
  const { copy } = getLocalization();
  const gallery = await searchNasaImages(query || "James Webb Space Telescope", 9);

  if (gallery.images.length === 0) {
    return <EmptyState title={copy.images.noImages} message={gallery.error ? copy.images.libraryUnavailable : copy.images.searchHint} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {gallery.images.map((image) => (
        <SpaceImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
