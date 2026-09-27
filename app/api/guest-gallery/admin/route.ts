import { NextResponse } from "next/server";
import { guestGalleryError } from "@/lib/guest-gallery/http";
import { listModerationQueue, moderateSubmission } from "@/lib/guest-gallery/service";
import { getStudioSession } from "@/lib/studio/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getStudioSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Please sign in to review memories." },
      { status: 401 },
    );
  }
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const queue = await listModerationQueue();
    return NextResponse.json({ success: true, ...queue });
  } catch (error) {
    return guestGalleryError(error);
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { id?: string; action?: string };
    const action = body.action;
    if (action !== "approve" && action !== "reject" && action !== "delete") {
      return NextResponse.json(
        { success: false, error: "Choose approve, reject, or delete." },
        { status: 400 },
      );
    }
    await moderateSubmission(String(body.id ?? ""), action);
    const queue = await listModerationQueue();
    return NextResponse.json({ success: true, ...queue });
  } catch (error) {
    return guestGalleryError(error);
  }
}
