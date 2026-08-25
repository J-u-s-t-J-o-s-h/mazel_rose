import { createImageUrlBuilder } from "@sanity/image-url";
import { stegaClean } from "@sanity/client/stega";
import { dataset, projectId } from "@/sanity/env";

type SanityImageSource = Parameters<
  ReturnType<typeof createImageUrlBuilder>["image"]
>[0];

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  const image = builder.image(source).auto("format");
  if (typeof source === "object" && source && "hotspot" in source && source.hotspot) {
    return image.fit("crop");
  }
  return image.fit("max");
}

export function resolveImageUrl(
  source: SanityImageSource | string | null | undefined,
  width = 1600,
): string | undefined {
  if (!source) return undefined;
  if (typeof source === "string") {
    const cleaned = stegaClean(source);
    return cleaned || undefined;
  }
  try {
    const url = urlForImage(source).width(width).url();
    return url ? stegaClean(url) : undefined;
  } catch {
    return undefined;
  }
}
