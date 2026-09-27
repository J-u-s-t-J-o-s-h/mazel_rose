import "server-only";

export type SupabaseConfig = {
  url: string;
  serviceKey: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

export function requireSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig();
  if (!config) {
    throw new GuestGalleryError(
      "Sharing is temporarily unavailable. Please try again later.",
      503,
    );
  }
  return config;
}

export class GuestGalleryError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "GuestGalleryError";
    this.status = status;
  }
}

function headers(config: SupabaseConfig, extra?: HeadersInit): Headers {
  const result = new Headers(extra);
  result.set("apikey", config.serviceKey);
  result.set("Authorization", `Bearer ${config.serviceKey}`);
  return result;
}

export async function rest<T>(
  path: string,
  init: RequestInit & { prefer?: string } = {},
): Promise<T> {
  const config = requireSupabaseConfig();
  const requestHeaders = headers(config, init.headers);
  if (init.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (init.prefer) requestHeaders.set("Prefer", init.prefer);

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Guest gallery database request failed", response.status, detail.slice(0, 500));
    throw new GuestGalleryError(
      "Sharing is temporarily unavailable. Please try again later.",
      503,
    );
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function storageFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const config = requireSupabaseConfig();
  const requestHeaders = headers(config, init.headers);
  return fetch(`${config.url}/storage/v1/${path}`, {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
  });
}
