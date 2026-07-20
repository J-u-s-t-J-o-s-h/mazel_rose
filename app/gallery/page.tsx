import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { createPageMetadata } from "@/lib/metadata";
import { getGalleryPage, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Gallery",
    description: `An editorial gallery for ${site.coupleNames.display}.`,
    path: "/gallery",
    site,
  });
}

export default async function GalleryPage() {
  const gallery = await getGalleryPage();

  return (
    <>
      <PageHero
        script={gallery.intro.scriptIntro}
        title={gallery.intro.title}
        description={gallery.intro.body}
        tone="wine"
      />
      <section className="bg-wine-black px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <GalleryGrid
            images={gallery.images}
            showCaptions={gallery.showCaptions}
          />
        </div>
      </section>
    </>
  );
}
