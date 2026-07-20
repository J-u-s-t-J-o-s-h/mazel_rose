import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/utils";

export async function GET(request: Request) {
  (await draftMode()).disable();
  const url = new URL(request.url);
  const next = url.searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(next, getSiteUrl()));
}
