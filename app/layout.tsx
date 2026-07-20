import type { Metadata } from "next";
import { draftMode } from "next/headers";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Manrope,
} from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { SiteShell } from "@/components/layout/SiteShell";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { DisableDraftMode } from "@/components/preview/DisableDraftMode";
import { DraftModeBanner } from "@/components/preview/DraftModeBanner";
import { createPageMetadata, weddingEventJsonLd } from "@/lib/metadata";
import { isSanityConfigured } from "@/sanity/env";
import {
  getSearchIndexingAllowed,
  getSocialImageUrl,
  getWeddingDetails,
} from "@/sanity/lib/getContent";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [site, allowIndexing, socialImageUrl] = await Promise.all([
    getWeddingDetails({ stega: false }),
    getSearchIndexingAllowed(),
    getSocialImageUrl(),
  ]);

  return createPageMetadata({
    title: site.social.title,
    description: site.social.description,
    path: "/",
    site,
    noIndex: !allowIndexing,
    socialImageUrl,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getWeddingDetails();
  const isDraft = (await draftMode()).isEnabled;
  const jsonLd = weddingEventJsonLd(site);

  let SanityLive: React.ComponentType | null = null;
  if (isSanityConfigured()) {
    ({ SanityLive } = await import("@/sanity/lib/live"));
  }

  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${script.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-charcoal">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteProvider value={site}>
          {isDraft ? <DraftModeBanner /> : null}
          <SiteShell>{children}</SiteShell>
          {SanityLive ? <SanityLive /> : null}
          {isDraft ? (
            <>
              <VisualEditing />
              <DisableDraftMode />
            </>
          ) : null}
        </SiteProvider>
      </body>
    </html>
  );
}
