import { GuestMemories } from "@/components/gallery/GuestMemories";
import { UnsolicitedAdvice } from "@/components/gallery/UnsolicitedAdvice";
import { listPublicGallery } from "@/lib/guest-gallery/service";
import { getSupabaseConfig } from "@/lib/guest-gallery/supabase";
import type { PublicAdvice, PublicMemory } from "@/lib/guest-gallery/types";

export async function GuestMemoriesSection() {
  if (!getSupabaseConfig()) {
    return <GuestMemories status="unconfigured" memories={[]} />;
  }

  let memories: PublicMemory[] | null = null;
  let advice: PublicAdvice[] = [];
  let failed = false;
  try {
    const gallery = await listPublicGallery();
    memories = gallery.memories;
    advice = gallery.advice;
  } catch (error) {
    console.error("Guest memories could not be loaded", error);
    failed = true;
  }

  if (failed || !memories) {
    return <GuestMemories status="unavailable" memories={[]} />;
  }

  return (
    <>
      <GuestMemories
        status={memories.length ? "ready" : "empty"}
        memories={memories}
      />
      <UnsolicitedAdvice notes={advice} />
    </>
  );
}
