import { NextResponse } from "next/server";
import { guestGalleryError } from "@/lib/guest-gallery/http";
import { prepareGuestSubmission } from "@/lib/guest-gallery/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await prepareGuestSubmission(request, body);
    if ("ignored" in result) {
      return NextResponse.json({ success: true, ignored: true });
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return guestGalleryError(error);
  }
}
