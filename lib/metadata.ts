import type { Metadata } from "next";
import type { SiteConfig } from "@/types/content";
import { siteConfig as fallbackSite } from "@/content/site";
import { getSiteUrl, shouldNoIndex } from "@/lib/utils";

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  site?: SiteConfig;
  noIndex?: boolean;
  socialImageUrl?: string;
};

export function createPageMetadata({
  title,
  description,
  path = "",
  site = fallbackSite,
  noIndex,
  socialImageUrl,
}: PageMetaInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${path}`;
  const fullTitle =
    path === "" || path === "/"
      ? `${site.brandName} — ${site.coupleNames.display}`
      : `${title} · ${site.brandName}`;

  const blockIndexing = noIndex !== undefined ? noIndex : shouldNoIndex();
  const robots = blockIndexing
    ? { index: false as const, follow: false as const }
    : { index: true as const, follow: true as const };

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.brandName,
      type: "website",
      locale: "en_US",
      ...(socialImageUrl
        ? { images: [{ url: socialImageUrl, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
    },
    robots,
  };
}

export function weddingEventJsonLd(site: SiteConfig = fallbackSite) {
  return {
    "@context": "https://schema.org",
    "@type": "WeddingEvent",
    name: `${site.coupleNames.display} Wedding`,
    startDate: site.weddingDateIso,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: site.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.venue.address,
        addressLocality: site.location.city,
        addressRegion: site.location.state,
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Person",
      name: site.coupleNames.display,
      email: site.contactEmail,
    },
    description: site.social.description,
  };
}
