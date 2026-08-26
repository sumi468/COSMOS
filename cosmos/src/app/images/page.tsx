import PageShell, { SectionHeading } from "@/components/PageShell";
import SpaceImageCard from "@/components/SpaceImageCard";
import SearchBar from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { getApod, searchNasaImages } from "@/lib/nasa";

export const revalidate = 3600;
export const metadata = { title: "Space Images" };

export default async function ImagesPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim();
  const [{ image: apod, stale, error }, gallery] = await Promise.all([
    getApod(),
    searchNasaImages(query || "James Webb Space Telescope", 9)
  ]);

  return (
    <PageShell>
      <SectionHeading eyebrow="Space Images" title="Picture of the Day" />
      {error && <p className="text-sm text-cosmos-amber mb-4">{error}{stale ? " — showing the last saved image." : ""}</p>}

      {apod ? (
        <div className="max-w-2xl">
          <SpaceImageCard image={apod} priority />
        </div>
      ) : (
        <EmptyState title="NASA APODを取得できませんでした" message="Try again shortly." />
      )}

      <div className="mt-12">
        <SectionHeading eyebrow="Gallery" title="NASA Image and Video Library" />
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
          <EmptyState title="No images found" message={gallery.error ?? "Try a different search term."} />
        )}
      </div>
    </PageShell>
  );
}
