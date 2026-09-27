import { contentDisposition, getPublicDownload, openPublicDownload } from "@/lib/guest-gallery/download";
import { guestGalleryError } from "@/lib/guest-gallery/http";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const file = await getPublicDownload(id);
    if (!file) {
      return new Response("That upload is no longer in the gallery.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
    const stored = await openPublicDownload(file);
    const headers = new Headers();
    headers.set("Content-Type", file.mimeType);
    headers.set("Content-Disposition", contentDisposition(file.filename));
    headers.set("Cache-Control", "private, no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    const length = stored.headers.get("content-length");
    if (length) headers.set("Content-Length", length);
    return new Response(stored.body, { headers });
  } catch (error) {
    return guestGalleryError(error);
  }
}
