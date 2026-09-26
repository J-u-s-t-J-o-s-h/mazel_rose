import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { getSiteUrl } from "@/lib/utils";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The API, not the CDN. A stale CDN document made the RSVP deadline
  // render as the previous calendar day after timezone conversion.
  useCdn: false,
  perspective: "published",
  stega: {
    studioUrl: `${getSiteUrl()}${studioUrl}`,
  },
});
