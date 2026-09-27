import { contentDisposition, listPublicDownloads, archivePublicDownloads } from "@/lib/guest-gallery/download";
import { guestGalleryError } from "@/lib/guest-gallery/http";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  try {
    const files = await listPublicDownloads();
    if (!files.length) {
      return new Response("There are no photos or videos to save yet.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
    const archive = await archivePublicDownloads(files);
    return new Response(archive, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": contentDisposition("mazel-rose-guest-photos.zip"),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return guestGalleryError(error);
  }
}
