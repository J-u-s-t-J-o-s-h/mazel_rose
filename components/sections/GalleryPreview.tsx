import type { GalleryImage, HomeContent } from "@/types/content";
import { FadeIn } from "@/components/motion/FadeIn";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GalleryPreview({
  galleryPreview,
  images,
}: {
  galleryPreview: HomeContent["galleryPreview"];
  images: GalleryImage[];
}) {
  const previewImages = images.slice(0, 4);

  return (
    <section className="bg-ivory px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <SectionHeading
            title={galleryPreview.title}
            description={galleryPreview.body}
            dividerTone="brass"
          />
        </FadeIn>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {previewImages.map((image, index) => (
            <FadeIn
              key={image.id}
              delay={index * 0.06}
              className={index % 2 === 1 ? "md:mt-10" : undefined}
            >
              <ImageReveal
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="aspect-[3/4] border border-sterling/40"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 text-center">
          <Button href="/gallery" variant="primary">
            {galleryPreview.ctaLabel}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
