import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { getSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return siteConfig.navigation.map((item) => ({
    url: `${base}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" || item.href === "/rsvp" ? 1 : 0.7,
  }));
}
