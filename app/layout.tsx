import type { Metadata } from "next";
import { draftMode } from "next/headers";
import {
  Cormorant_Garamond,
  EB_Garamond,
  Great_Vibes,
  Manrope,
  Pinyon_Script,
  Playfair_Display,
} from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { PreviewModeProvider } from "@/components/providers/PreviewModeProvider";
import { VisualEditing } from "next-sanity/visual-editing";
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

// Fonts for the theme presets. Each is assigned a uniquely named CSS variable;
// globals.css maps --font-serif / --font-sans / --font-script to the right one
// per `data-theme`, so switching a theme swaps the type without new loads.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ebgaramond",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const fontVariables = [
  cormorant.variable,
  manrope.variable,
  greatVibes.variable,
  playfair.variable,
  ebGaramond.variable,
  pinyon.variable,
].join(" ");

// Valid theme presets. A stega watermark or unknown value falls back to classic.
const THEME_KEYS = ["classic", "midnight", "sage", "coastal"];

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

  // Strip any stega watermark characters, then validate against the presets.
  const rawTheme = String(site.theme ?? "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  const themeKey = THEME_KEYS.includes(rawTheme) ? rawTheme : "classic";

  let SanityLive: React.ComponentType | null = null;
  if (isSanityConfigured()) {
    ({ SanityLive } = await import("@/sanity/lib/live"));
  }

  return (
    <html
      lang="en"
      data-theme={themeKey}
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-charcoal">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteProvider value={site}>
          <PreviewModeProvider value={isDraft}>
            {isDraft ? <DraftModeBanner /> : null}
            <SiteShell>{children}</SiteShell>
            {SanityLive ? <SanityLive /> : null}
            {isDraft ? (
              <>
                <VisualEditing />
                <DisableDraftMode />
              </>
            ) : null}
          </PreviewModeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
