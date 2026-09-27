import { GuestMemories } from "@/components/gallery/GuestMemories";
import { listPublicMemories } from "@/lib/guest-gallery/service";
import { getSupabaseConfig } from "@/lib/guest-gallery/supabase";
import type { PublicMemory } from "@/lib/guest-gallery/types";

export async function GuestMemoriesSection() {
  if (!getSupabaseConfig()) {
    return <GuestMemories status="unconfigured" memories={[]} />;
  }

  let memories: PublicMemory[] | null = null;
  let failed = false;
  try {
    memories = await listPublicMemories();
  } catch (error) {
    console.error("Guest memories could not be loaded", error);
    failed = true;
  }

  if (failed || !memories) {
    return <GuestMemories status="unavailable" memories={[]} />;
  }

  return (
    <GuestMemories
      status={memories.length ? "ready" : "empty"}
      memories={memories}
    />
  );
}
