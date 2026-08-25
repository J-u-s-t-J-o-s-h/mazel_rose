import type { Metadata } from "next";
import { StudioShell } from "@/components/studio/StudioShell";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default async function StudioAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStudioUser("/studio");
  return <StudioShell user={user}>{children}</StudioShell>;
}
