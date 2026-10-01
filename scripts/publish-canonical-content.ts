/**
 * Targeted production content update. Does not run the full seed.
 *
 * Writes the confirmed November 2026 schedule first, reads it back, and
 * only then patches deadlines, FAQ copy, and registry wording.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/publish-canonical-content.ts
 */

import { createClient } from "@sanity/client";
import { LexoRank } from "lexorank";
import { siteConfig } from "../content/site";
import { faqs, faqsIntro } from "../content/faqs";
import { registryItems } from "../content/registry";
import { scheduleEvents } from "../content/schedule";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

const BANNED = [
  "October 18, 2027",
  "October 17, 2027",
  "September 1, 2027",
  "September 10, 2026",
  "2027-09-01",
  "2026-10-02",
  "The Willow Estate",
  "Aiken",
  "on-site valet",
  "complimentary shuttle",
  "indoor contingency",
  "hello@mazel.rose",
  "Romantic. Rich. Timeless.",
  "PLACEHOLDER",
];

function assertSafe(label: string, value: unknown) {
  const text = JSON.stringify(value);
  for (const term of BANNED) {
    if (text.includes(term)) {
      throw new Error(`${label} still contains "${term}"`);
    }
  }
}

function rankSeries(count: number) {
  let rank = LexoRank.min();
  return Array.from({ length: count }, () => {
    rank = rank.genNext().genNext();
    return rank.toString();
  });
}

async function publishSchedule() {
  assertSafe("schedule fallback", scheduleEvents);

  const ranks = rankSeries(scheduleEvents.length);
  const transaction = client.transaction();

  scheduleEvents.forEach((event, index) => {
    transaction.createOrReplace({
      _id: `scheduleEvent.${event.id}`,
      _type: "scheduleEvent",
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      address: event.address,
      description: event.description,
      dressCode: event.dressCode,
      mapUrl: event.mapUrl,
      websiteUrl: event.websiteUrl,
      websiteLabel: event.websiteLabel,
      parking: event.parking,
      invitationOnly: false,
      isPrivate: false,
      featured: event.id === "ceremony" || event.id === "reception",
      showOnWebsite: true,
      displayOrder: index,
      orderRank: ranks[index],
    });
  });

  await transaction.commit();

  const published = await client.fetch<
    Array<{
      _id: string;
      title: string;
      date: string;
      venue: string;
      address: string;
      description: string;
      startTime: string;
      endTime?: string;
    }>
  >(
    `*[_type == "scheduleEvent" && showOnWebsite != false] | order(orderRank asc) {
      _id, title, date, venue, address, description, startTime, endTime
    }`,
  );

  assertSafe("published schedule", published);

  const titles = published.map((event) => event.title);
  for (const required of [
    "The Night Before Paradise ✨",
    "Ceremony",
    "Cocktail Hour",
    "Give Thanks and Come Celebrate",
  ]) {
    if (!titles.includes(required)) {
      throw new Error(`Published schedule is missing ${required}`);
    }
  }

  const blob = JSON.stringify(published);
  if (!blob.includes("November 7, 2026") || !blob.includes("November 8, 2026")) {
    throw new Error("Published schedule is missing the November 2026 dates");
  }
  if (!blob.includes("Paradise Cove") || !blob.includes("3:15 PM")) {
    throw new Error("Published schedule is missing Paradise Cove or the 3:15 arrival");
  }

  console.log("Schedule verified:");
  for (const event of published) {
    console.log(
      `- ${event.date} | ${event.startTime}${event.endTime ? `–${event.endTime}` : ""} | ${event.title} | ${event.venue}`,
    );
  }
}

async function patchSingletons() {
  const details = await client.getDocument("weddingDetails");
  const location = String(details?.locationDisplay || siteConfig.location.display).trim();
  const dateDisplay = String(details?.weddingDateDisplay || siteConfig.weddingDateDisplay).trim();
  const introduction = `We hope you will join us in ${location}. Please reply by ${siteConfig.rsvpDeadlineDisplay}.`;

  assertSafe("rsvp introduction", introduction);

  await client
    .patch("weddingDetails")
    .set({
      rsvpDeadline: "2026-10-12T16:00:00.000Z",
      rsvpDeadlineDisplay: siteConfig.rsvpDeadlineDisplay,
      weddingDateDisplay: dateDisplay || siteConfig.weddingDateDisplay,
      tagline: "",
    })
    .commit();

  await client
    .patch("rsvpFormSettings")
    .set({
      introduction,
      rsvpDeadlineDisplay: siteConfig.rsvpDeadlineDisplay,
      mealOptions: [],
    })
    .commit();

  await client
    .patch("faqPage")
    .set({
      introduction: faqsIntro.body,
      contactEmail: siteConfig.contactEmail,
    })
    .commit();

  const home = await client.getDocument("homePage");
  const highlights = Array.isArray(home?.travelPreviewHighlights)
    ? (home.travelPreviewHighlights as string[])
    : [];
  if (highlights.some((item) => item.toLowerCase().includes("shuttle"))) {
    await client
      .patch("homePage")
      .set({
        travelPreviewHighlights: highlights.map((item) =>
          item.toLowerCase().includes("shuttle")
            ? "Driving and parking notes"
            : item,
        ),
      })
      .commit();
    console.log("Removed shuttle wording from the home travel highlights.");
  }
}

async function publishFaqs() {
  assertSafe("faq fallback", { faqs, faqsIntro });
  const ranks = rankSeries(faqs.length);
  const transaction = client.transaction();

  faqs.forEach((faq, index) => {
    transaction.createOrReplace({
      _id: `faqItem.${faq.id}`,
      _type: "faqItem",
      question: faq.question,
      answer: faq.answer,
      showOnWebsite: true,
      displayOrder: index,
      orderRank: ranks[index],
    });
  });

  await transaction.commit();
  console.log(`Published ${faqs.length} FAQ items.`);
}

async function publishRegistryWording() {
  assertSafe("registry cards", registryItems);
  for (const [index, item] of registryItems.entries()) {
    const id = `registryLink.${item.id}`;
    const existing = await client.getDocument(id);
    if (existing) {
      await client
        .patch(id)
        .set({
          description: item.description,
          url: item.url,
          buttonLabel: item.buttonLabel,
        })
        .commit();
    } else {
      await client.createOrReplace({
        _id: id,
        _type: "registryLink",
        name: item.name,
        registryType: item.type,
        description: item.description,
        url: item.url,
        buttonLabel: item.buttonLabel || "Learn more",
        featured: false,
        showOnWebsite: true,
        displayOrder: index,
      });
    }
  }
  console.log("Registry card wording updated.");
}

async function main() {
  console.log(`Updating ${projectId}/${dataset} without running the full seed.`);
  await publishSchedule();
  await patchSingletons();
  await publishFaqs();
  await publishRegistryWording();

  const check = await client.fetch<{
    deadline: string;
    deadlineDisplay: string;
    dateDisplay: string;
    tagline: string | null;
    faqIntro: string;
    faqEmail: string;
    mealCount: number;
  }>(
    `{
      "deadline": *[_id == "weddingDetails"][0].rsvpDeadline,
      "deadlineDisplay": *[_id == "weddingDetails"][0].rsvpDeadlineDisplay,
      "dateDisplay": *[_id == "weddingDetails"][0].weddingDateDisplay,
      "tagline": *[_id == "weddingDetails"][0].tagline,
      "faqIntro": *[_id == "faqPage"][0].introduction,
      "faqEmail": *[_id == "faqPage"][0].contactEmail,
      "mealCount": count(*[_id == "rsvpFormSettings"][0].mealOptions)
    }`,
  );

  assertSafe("singleton check", check);
  console.log("Singleton check:", JSON.stringify(check, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
