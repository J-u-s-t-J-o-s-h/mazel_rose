import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "@/components/save-the-date/save-the-date.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

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
  return <div className={`save-the-date-root ${cinzel.variable}`}>{children}</div>;
}
