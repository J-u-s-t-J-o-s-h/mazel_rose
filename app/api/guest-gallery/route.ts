import { NextResponse } from "next/server";
import { guestGalleryError } from "@/lib/guest-gallery/http";
import { prepareGuestSubmission, submitGuestAdvice } from "@/lib/guest-gallery/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result =
      body?.kind === "advice"
        ? await submitGuestAdvice(request, body)
        : await prepareGuestSubmission(request, body);
    if ("ignored" in result) {
      return NextResponse.json({ success: true, ignored: true });
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return guestGalleryError(error);
  }
}
