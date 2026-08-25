import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { sanitizePath } from "@/lib/studio/paths";
import { getStudioSession } from "@/lib/studio/users";

export async function GET(request: Request) {
  const session = await getStudioSession();
  if (!session) {
    redirect("/studio/login");
  }

  const url = new URL(request.url);
  const path = sanitizePath(url.searchParams.get("path") || "/");
  (await draftMode()).enable();
  redirect(path);
}
