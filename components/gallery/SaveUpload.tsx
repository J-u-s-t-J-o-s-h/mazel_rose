const saveClassName =
  "inline-flex min-h-12 items-center justify-center rounded-sm border border-ivory/40 px-5 text-base normal-case tracking-normal text-ivory hover:border-brass hover:text-champagne";

export function SaveUploadLink({
  id,
  mediaType,
}: {
  id: string;
  mediaType: "image" | "video";
}) {
  const label = mediaType === "video" ? "Save this video" : "Save this photo";
  return (
    <a href={`/api/guest-gallery/download/${id}`} className={`${saveClassName} mt-4`}>
      {label}
    </a>
  );
}

export function SaveAllUploadsLink({
  hasImage,
  hasVideo,
}: {
  hasImage: boolean;
  hasVideo: boolean;
}) {
  const label =
    hasImage && hasVideo ? "Save all photos and videos" : hasVideo ? "Save all videos" : "Save all photos";
  return (
    <a href="/api/guest-gallery/download" className={saveClassName}>
      {label}
    </a>
  );
}
