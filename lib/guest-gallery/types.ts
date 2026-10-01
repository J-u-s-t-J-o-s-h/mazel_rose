export type PublicMemoryMedia = {
  id: string;
  mediaType: "image" | "video";
  mimeType: string;
  url: string;
  sortOrder: number;
};

export type PublicMemory = {
  id: string;
  guestName: string;
  message: string | null;
  createdAt: string;
  media: PublicMemoryMedia[];
};

export type PublicAdvice = {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
};

export type GuestGalleryStatus = "ready" | "empty" | "unavailable" | "unconfigured";
