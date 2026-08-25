import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
