import { NextResponse } from "next/server";
import {
  abandonGuestSubmission,
  finalizeGuestSubmission,
} from "@/lib/guest-gallery/service";
import { GuestGalleryError } from "@/lib/guest-gallery/supabase";

export function guestGalleryError(error: unknown) {
  if (error instanceof GuestGalleryError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status },
    );
  }
  console.error("Guest gallery request failed", error);
  return NextResponse.json(
    { success: false, error: "Something went wrong. Please try again." },
    { status: 500 },
  );
}

export async function finalizeFromRequest(request: Request) {
  const body = (await request.json()) as {
    submissionId?: string;
    uploadToken?: string;
  };
  await finalizeGuestSubmission({
    submissionId: String(body.submissionId ?? ""),
    uploadToken: String(body.uploadToken ?? ""),
  });
  return NextResponse.json({ success: true });
}

export async function abandonFromRequest(request: Request) {
  const body = (await request.json()) as {
    submissionId?: string;
    uploadToken?: string;
  };
  await abandonGuestSubmission({
    submissionId: String(body.submissionId ?? ""),
    uploadToken: String(body.uploadToken ?? ""),
  });
  return NextResponse.json({ success: true });
}
