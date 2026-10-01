import { Download } from "lucide-react";

const saveClassName =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-ivory px-5 text-base normal-case tracking-normal text-wine-black hover:bg-champagne";

export function SaveUploadLink({
  id,
  mediaType,
}: {
  id: string;
  mediaType: "image" | "video";
}) {
  const label = mediaType === "video" ? "Save this video" : "Save this photo";
  return (
    <a href={`/api/guest-gallery/download/${id}`} download className={saveClassName}>
      <Download className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}
