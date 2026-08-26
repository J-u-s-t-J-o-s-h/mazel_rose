import type { Metadata } from "next";
import { Cinzel, Italiana, Jost } from "next/font/google";
import "@/components/save-the-date/save-the-date.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

// The splash card sets its names in Italiana and its small caps in Jost.
// Cormorant Garamond is already loaded by the root layout.
const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const splashFontVariables = `${italiana.variable} ${jost.variable}`;

export const metadata: Metadata = {
  title: "Tiffany & Cary | Save the Date",
  description:
    "Save the date for Tiffany and Cary’s wedding celebration on November 8, 2026.",
};

export default function SaveTheDateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preload"
        href="/tiffany-cary/hero-coastal-chuppah.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
      <div
        className={`save-the-date-root ${cinzel.variable} ${splashFontVariables}`}
      >
        {children}
      </div>
    </>
  );
}
