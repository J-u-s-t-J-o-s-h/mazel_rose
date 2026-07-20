import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { getSiteUrl } from "@/lib/utils";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl: `${getSiteUrl()}${studioUrl}`,
  },
});
