import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InvitationExperience } from "@/components/save-the-date/InvitationExperience";
import { SAVE_THE_DATE_COOKIE } from "@/lib/save-the-date/cookie";
import { SAVE_THE_DATE_PATH } from "@/lib/save-the-date/paths";
import { createPageMetadata } from "@/lib/metadata";
import { getWeddingDetails } from "@/sanity/lib/getContent";

type PageProps = {
  searchParams: Promise<{
    preview?: string | string[];
    intro?: string | string[];
  }>;
};

function isFlagEnabled(value: string | string[] | undefined): boolean {
  const flag = Array.isArray(value) ? value[0] : value;
  return flag === "1";
}

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Save the Date",
    description:
      "Save the date for Tiffany and Cary’s wedding celebration on November 8, 2026.",
    path: SAVE_THE_DATE_PATH,
    site,
    socialImageUrl: "/tiffany-cary/og-save-the-date.png",
  });
}

export default async function SaveTheDatePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const preview = isFlagEnabled(params.preview);
  const forceIntro = isFlagEnabled(params.intro);
  const cookieStore = await cookies();
  const completed = cookieStore.get(SAVE_THE_DATE_COOKIE)?.value;

  if (completed && !preview) {
    redirect("/");
  }

  return <InvitationExperience forceIntro={forceIntro} />;
}
