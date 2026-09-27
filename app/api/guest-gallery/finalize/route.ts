import { finalizeFromRequest, guestGalleryError } from "@/lib/guest-gallery/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    return await finalizeFromRequest(request);
  } catch (error) {
    return guestGalleryError(error);
  }
}
