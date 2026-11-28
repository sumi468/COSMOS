import PageShell, { SectionHeading } from "@/components/PageShell";
import SpaceImageCard from "@/components/SpaceImageCard";
import SearchBar from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { getApod, searchNasaImages } from "@/lib/nasa";
import { getLocalization } from "@/lib/localization";

export const revalidate = 3600;
export function generateMetadata() {
  return { title: getLocalization().copy.images.title };
}

export default async function ImagesPage({ searchParams }: { searchParams: { q?: string } }) {
  const { copy } = getLocalization();
  const query = searchParams.q?.trim();
  const [{ image: apod, stale, error }, gallery] = await Promise.all([
    getApod(),
    searchNasaImages(query || "James Webb Space Telescope", 9)
  ]);

  return (
    <PageShell>
      <SectionHeading as="h1" eyebrow={copy.images.title} title={copy.images.pictureOfDay} />
      {apod && error && (
        <p className="text-sm text-cosmos-warning mb-4">
          {copy.images.apodUnavailable} {stale && copy.images.savedImage}
        </p>
      )}

      {apod ? (
        <SpaceImageCard image={apod} featured />
      ) : (
        <EmptyState title={copy.images.apodUnavailable} message={copy.images.retrySoon} />
      )}

      <div className="mt-12">
        <SectionHeading eyebrow={copy.images.gallery} title={copy.images.library} />
        <div className="mb-6">
          <SearchBar action="/images" defaultValue={query} />
        </div>
        {gallery.images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.images.map((img) => (
              <SpaceImageCard key={img.id} image={img} />
            ))}
          </div>
        ) : (
          <EmptyState title={copy.images.noImages} message={gallery.error ? copy.images.libraryUnavailable : copy.images.searchHint} />
        )}
      </div>
    </PageShell>
  );
}
