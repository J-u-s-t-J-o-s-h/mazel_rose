import { createClient } from "@sanity/client";
import { LexoRank } from "lexorank";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

const LIST_TYPES = [
  "scheduleEvent",
  "airport",
  "hotel",
  "registryLink",
  "weddingPartyMember",
  "galleryPhoto",
  "activity",
  "faqItem",
];

async function backfillRanks() {
  for (const type of LIST_TYPES) {
    const docs = await client.fetch<
      Array<{ _id: string; orderRank?: string; displayOrder?: number }>
    >(
      `*[_type == $type] | order(displayOrder asc, _id asc){_id, orderRank, displayOrder}`,
      { type },
    );

    let rank = LexoRank.min();
    const tx = client.transaction();
    let changed = 0;
    for (const doc of docs) {
      rank = rank.genNext().genNext();
      if (doc.orderRank) continue;
      tx.patch(doc._id, { set: { orderRank: rank.toString() } });
      changed += 1;
    }
    if (changed) {
      await tx.commit({ autoGenerateArrayKeys: true });
      console.log(`✓ ${type}: set orderRank on ${changed} documents`);
    } else {
      console.log(`• ${type}: already ranked`);
    }
  }
}

async function backfillGalleryCards() {
  const settings = await client.fetch<{
    photos?: unknown[];
  } | null>(`*[_id == "gallerySettings"][0]{photos}`);

  if (settings?.photos?.length) {
    console.log("• gallerySettings.photos already populated");
    return;
  }

  const photos = await client.fetch<
    Array<{
      _id: string;
      caption?: string;
      photographerCredit?: string;
      category?: string;
      image?: unknown;
    }>
  >(
    `*[_type == "galleryPhoto"] | order(displayOrder asc){_id, caption, photographerCredit, category, image}`,
  );

  const cards = photos.map((photo, index) => ({
    _key: photo._id.replace(/[^\w]/g, "").slice(-12) || `photo${index}`,
    _type: "galleryPhotoItem",
    caption: photo.caption,
    photographerCredit: photo.photographerCredit,
    category: photo.category,
    ...(photo.image ? { image: photo.image } : {}),
  }));

  await client.patch("gallerySettings").set({ photos: cards }).commit();
  console.log(`✓ gallerySettings.photos: copied ${cards.length} cards`);
}

async function main() {
  await backfillRanks();
  await backfillGalleryCards();
  console.log("Backfill complete.");
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
