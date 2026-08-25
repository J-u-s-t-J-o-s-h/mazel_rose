import { createClient, type SanityClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export function isStudioConfigured(): boolean {
  return Boolean(
    process.env.STUDIO_SESSION_SECRET &&
      process.env.STUDIO_SESSION_SECRET.length >= 16,
  );
}

export function hasSanityWriteAccess(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "placeholder" &&
      process.env.SANITY_API_WRITE_TOKEN,
  );
}

function requireWriteToken(): string {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is not set.");
  }
  return token;
}

export function getProductionWriteClient(): SanityClient {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: requireWriteToken(),
    useCdn: false,
    perspective: "raw",
  });
}

export function publishedId(id: string): string {
  return id.replace(/^drafts\./, "");
}

export function draftId(id: string): string {
  const clean = publishedId(id);
  return `drafts.${clean}`;
}
