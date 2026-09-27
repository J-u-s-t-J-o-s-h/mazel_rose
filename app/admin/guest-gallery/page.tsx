import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryAdminLogin } from "@/components/gallery/GalleryAdminLogin";
import { GalleryModeration } from "@/components/gallery/GalleryModeration";
import { listModerationQueue } from "@/lib/guest-gallery/service";
import { GuestGalleryError } from "@/lib/guest-gallery/supabase";
import { isStudioConfigured } from "@/lib/studio/clients";
import { getStudioSession } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guest memories",
  robots: { index: false, follow: false },
};

export default async function GuestGalleryAdminPage() {
  const session = await getStudioSession();
  if (!session) {
    return <GalleryAdminLogin configured={isStudioConfigured()} />;
  }

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-parchment px-6 py-12">
          <p className="font-serif text-2xl text-wine-black" role="status">
            Loading submissions…
          </p>
        </main>
      }
    >
      <ModerationLoader reviewer={session.name} />
    </Suspense>
  );
}

async function ModerationLoader({ reviewer }: { reviewer: string }) {
  let initial: Awaited<ReturnType<typeof listModerationQueue>> | null = null;
  let loadError: string | null = null;
  try {
    initial = await listModerationQueue();
  } catch (error) {
    console.error("Guest gallery moderation could not be loaded", error);
    loadError =
      error instanceof GuestGalleryError
        ? error.message
        : "Memories couldn't be loaded.";
  }

  return (
    <GalleryModeration
      reviewer={reviewer}
      initial={initial}
      loadError={loadError}
    />
  );
}
