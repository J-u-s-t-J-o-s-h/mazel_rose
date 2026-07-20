import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";
import { getSearchIndexingAllowed } from "@/sanity/lib/getContent";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = getSiteUrl();
  const allowIndexing = await getSearchIndexingAllowed();

  if (!allowIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/gate", "/admin"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
