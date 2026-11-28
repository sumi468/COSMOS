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
  const [{ image: apod, stale }, gallery] = await Promise.all([
    getApod(),
    searchNasaImages(query || "James Webb Space Telescope", 9)
  ]);

  return (
    <PageShell>
      {apod && (
        <section className="mb-12">
          <SectionHeading as="h1" eyebrow={copy.images.title} title={copy.images.pictureOfDay} />
          {stale && (
            <p className="mb-4 text-sm text-cosmos-warning">{copy.images.savedImage}</p>
          )}
          <SpaceImageCard image={apod} featured />
        </section>
      )}

      <section>
        <SectionHeading
          as={apod ? "h2" : "h1"}
          eyebrow={apod ? copy.images.gallery : copy.images.title}
          title={copy.images.library}
        />
        {!apod && <p className="mb-4 text-sm text-cosmos-muted">{copy.images.apodUnavailable}</p>}
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
      </section>
    </PageShell>
  );
}
