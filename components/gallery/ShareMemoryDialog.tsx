"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField, fieldClassName } from "@/components/rsvp/FormField";
import {
  classifyGuestFile,
  displayFileName,
  GUEST_GALLERY_LIMITS,
  validateGuestFiles,
  validateGuestText,
  type GuestMediaType,
} from "@/lib/guest-gallery/limits";
import { HEIC_CONVERT_ERROR, normalizeGuestFile } from "@/lib/guest-gallery/convert-heic";
import { stripImageFile } from "@/lib/guest-gallery/strip-metadata";

type Attachment = {
  id: string;
  file: File;
  name: string;
  mimeType: string;
  mediaType: GuestMediaType;
  previewUrl: string;
  duration: number | null;
};

type ShareMemoryDialogProps = {
  open: boolean;
  onClose: () => void;
};

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ShareMemoryDialog({ open, onClose }: ShareMemoryDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const progressId = useId();
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const ingestRef = useRef(Promise.resolve());
  const preparingCount = useRef(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      nameRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open || !turnstileSiteKey) return;
    const scriptId = "turnstile-api";
    const render = () => {
      const target = document.getElementById("guest-gallery-turnstile");
      const turnstile = (window as TurnstileWindow).turnstile;
      if (!target || !turnstile || target.childElementCount > 0) return;
      turnstile.render(target, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => setTurnstileToken(token),
      });
    };
    if (document.getElementById(scriptId)) {
      render();
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [open]);

  function resetForm() {
    setGuestName("");
    setMessage("");
    setWebsite("");
    setAttachments((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setFormError(null);
    setProgress(null);
    setPreparing(false);
    setTurnstileToken(null);
  }

  function closeDialog() {
    if (uploading || preparing) return;
    setSucceeded(false);
    resetForm();
    onClose();
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    if (!incoming.length || uploading) return;
    preparingCount.current += 1;
    setPreparing(true);
    setFormError(null);
    ingestRef.current = ingestRef.current
      .then(() => ingestFiles(incoming))
      .finally(() => {
        preparingCount.current -= 1;
        if (preparingCount.current === 0) setPreparing(false);
      });
  }

  async function ingestFiles(incoming: File[]) {
    const prepared: File[] = [];
    let error: string | null = null;

    for (const file of incoming) {
      try {
        prepared.push(await normalizeGuestFile(file));
      } catch (caught) {
        error =
          caught instanceof Error && caught.message
            ? caught.message
            : HEIC_CONVERT_ERROR;
      }
    }

    const classified: Attachment[] = [];
    for (const file of prepared) {
      const result = classifyGuestFile({
        name: file.name,
        mimeType: file.type,
        size: file.size,
      });
      if (!result.ok) {
        error = result.error;
        continue;
      }
      classified.push({
        id: crypto.randomUUID(),
        file,
        name: displayFileName(file.name),
        mimeType: result.file.mimeType,
        mediaType: result.file.mediaType,
        previewUrl: URL.createObjectURL(file),
        duration: null,
      });
    }

    if (!classified.length) {
      setFormError(error);
      return;
    }

    let rejected = false;
    setAttachments((current) => {
      const next = [...current, ...classified];
      const group = validateGuestFiles(
        next.map((item) => ({ name: item.name, mimeType: item.mimeType, size: item.file.size })),
      );
      if (!group.ok) {
        rejected = true;
        error = group.error;
        return current;
      }
      return next;
    });
    if (rejected) {
      classified.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    }
    setFormError(error);
  }

  function removeAttachment(id: string) {
    setAttachments((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function moveAttachment(id: string, direction: -1 | 1) {
    setAttachments((current) => {
      const index = current.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (uploading || preparing) return;
    const text = validateGuestText({ guestName, message });
    if (!text.ok) {
      setFormError(text.error);
      return;
    }
    const files = validateGuestFiles(
      attachments.map((item) => ({
        name: item.name,
        mimeType: item.mimeType,
        size: item.file.size,
      })),
    );
    if (!files.ok) {
      setFormError(files.error);
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setFormError("Please confirm you are a guest and try again.");
      return;
    }

    setUploading(true);
    setFormError(null);
    setProgress({ done: 0, total: attachments.length });
    let submissionId = "";
    let uploadToken = "";

    try {
      const preparedFiles: Array<{ item: Attachment; file: File }> = [];
      for (const item of attachments) {
        const file =
          item.mediaType === "image" ? await stripImageFile(item.file, item.mimeType) : item.file;
        preparedFiles.push({ item, file });
      }

      const prepareResponse = await fetch("/api/guest-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: text.guestName,
          message: text.message ?? "",
          website,
          turnstileToken,
          files: preparedFiles.map(({ item, file }) => ({
            clientId: item.id,
            name: item.name,
            mimeType: item.mimeType,
            size: file.size,
          })),
        }),
      });
      const prepared = (await prepareResponse.json()) as {
        success?: boolean;
        ignored?: boolean;
        error?: string;
        submissionId?: string;
        uploadToken?: string;
        uploads?: Array<{ clientId: string; signedUrl: string; token: string }>;
      };
      if (!prepareResponse.ok || !prepared.success) {
        throw new Error(prepared.error || "We couldn't start your upload. Please try again.");
      }
      if (prepared.ignored) {
        setSucceeded(true);
        resetForm();
        return;
      }
      submissionId = prepared.submissionId || "";
      uploadToken = prepared.uploadToken || "";
      const uploads = prepared.uploads ?? [];

      for (let index = 0; index < preparedFiles.length; index += 1) {
        const target = uploads.find((upload) => upload.clientId === preparedFiles[index].item.id);
        if (!target) throw new Error("We couldn't start your upload. Please try again.");
        await uploadFile(target.signedUrl, preparedFiles[index].file, preparedFiles[index].item.mimeType);
        setProgress({ done: index + 1, total: preparedFiles.length });
      }

      const finalizeResponse = await fetch("/api/guest-gallery/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, uploadToken }),
      });
      const finalized = (await finalizeResponse.json()) as { success?: boolean; error?: string };
      if (!finalizeResponse.ok || !finalized.success) {
        throw new Error(finalized.error || "We couldn't finish saving your memory. Please try again.");
      }
      setSucceeded(true);
      resetForm();
      router.refresh();
    } catch (error) {
      if (submissionId && uploadToken) {
        await fetch("/api/guest-gallery/abandon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId, uploadToken }),
        }).catch(() => undefined);
      }
      setFormError(
        error instanceof Error
          ? error.message
          : "We couldn't upload your memory. Please try again.",
      );
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="w-[min(100%,40rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto border border-sterling/60 bg-ivory p-0 text-wine-black shadow-[var(--shadow-lift)] backdrop:bg-wine-black/75"
      onClose={closeDialog}
      onCancel={(event) => {
        if (uploading || preparing) event.preventDefault();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        if (!uploading && !preparing) closeDialog();
      }}
    >
      <form onSubmit={onSubmit} className="paper-texture p-6 sm:p-8" noValidate>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-script text-3xl text-burgundy">With love</p>
            <h2 id={titleId} className="mt-1 font-serif text-3xl">
              Share a Memory
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            disabled={uploading || preparing}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-sterling/70 text-wine-black hover:border-burgundy disabled:opacity-50"
            aria-label="Close share a memory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {succeeded ? (
          <div className="mt-8 space-y-3" role="status">
            <p className="font-serif text-2xl">Thank you for sharing a memory with us.</p>
            <p className="text-base leading-relaxed text-charcoal/80">
              Your memory is in the gallery.
            </p>
            <div className="pt-4">
              <Button type="button" onClick={closeDialog}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
              <label htmlFor="guest-gallery-website">Company</label>
              <input
                id="guest-gallery-website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <FormField label="Your name" htmlFor="guest-gallery-name" required error={undefined}>
              <input
                ref={nameRef}
                id="guest-gallery-name"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                autoComplete="name"
                maxLength={GUEST_GALLERY_LIMITS.nameMax}
                required
                className={fieldClassName}
              />
            </FormField>

            <FormField
              label="Leave us a message"
              htmlFor="guest-gallery-message"
              hint="Optional"
            >
              <textarea
                id="guest-gallery-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={GUEST_GALLERY_LIMITS.messageMax}
                rows={4}
                className={fieldClassName}
              />
            </FormField>

            <div>
              <label htmlFor="guest-gallery-files" className="block text-xs uppercase tracking-[0.16em] text-charcoal/70">
                Add photos or short videos
              </label>
              <div
                className={`mt-2 rounded-sm border border-dashed px-4 py-8 text-center ${
                  dragOver ? "border-burgundy bg-burgundy/5" : "border-sterling/80"
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(false);
                  if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
                }}
              >
                <input
                  ref={fileInputRef}
                  id="guest-gallery-files"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/heic-sequence,video/mp4,video/quicktime,.jpg,.jpeg,.png,.webp,.heic,.heif,.mp4,.mov"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    if (event.target.files?.length) addFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || preparing}
                  className="font-serif text-xl text-burgundy underline-offset-4 hover:underline"
                >
                  Choose photos or videos
                </button>
                <p className="mt-2 text-sm text-charcoal/70">
                  Or drop them here. JPEG, PNG, WebP, and HEIC/HEIF photos, or short MP4 and MOV videos. Up to 8 files, including 2 short videos. Photos up to 15 MB, videos up to 50 MB.
                </p>
              </div>
            </div>

            {attachments.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {attachments.map((item, index) => (
                  <li key={item.id} className="border border-sterling/60 bg-ivory p-3">
                    {item.mediaType === "image" ? (
                      // Guest previews are local object URLs, so the image optimizer cannot fetch them.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.previewUrl}
                        className="aspect-[4/3] w-full bg-wine-black object-contain"
                        controls
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={(event) => {
                          const duration = event.currentTarget.duration;
                          setAttachments((current) =>
                            current.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, duration: Number.isFinite(duration) ? duration : null }
                                : entry,
                            ),
                          );
                        }}
                      />
                    )}
                    <p className="mt-2 truncate text-sm text-charcoal">{item.name}</p>
                    {item.mediaType === "video" ? (
                      <p className="text-xs uppercase tracking-[0.14em] text-charcoal/60">
                        {item.duration ? formatDuration(item.duration) : "Video"}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => moveAttachment(item.id, -1)}
                        disabled={index === 0 || uploading || preparing}
                        className="text-xs uppercase tracking-[0.14em] text-burgundy disabled:opacity-40"
                      >
                        Move earlier
                      </button>
                      <button
                        type="button"
                        onClick={() => moveAttachment(item.id, 1)}
                        disabled={index === attachments.length - 1 || uploading || preparing}
                        className="text-xs uppercase tracking-[0.14em] text-burgundy disabled:opacity-40"
                      >
                        Move later
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAttachment(item.id)}
                        disabled={uploading || preparing}
                        className="text-xs uppercase tracking-[0.14em] text-burgundy disabled:opacity-40"
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {preparing ? (
              <p role="status" className="text-sm text-charcoal">
                Preparing photo…
              </p>
            ) : null}

            {turnstileSiteKey ? <div id="guest-gallery-turnstile" /> : null}

            {progress ? (
              <p id={progressId} role="status" className="text-sm text-charcoal">
                Uploading your memories... {progress.done} of {progress.total} files uploaded
              </p>
            ) : null}
            {formError ? (
              <p role="alert" className="text-sm text-burgundy">
                {formError}
              </p>
            ) : null}

            <Button type="submit" disabled={uploading || preparing} aria-busy={uploading || preparing}>
              {uploading ? "Uploading" : "Share this memory"}
            </Button>
          </div>
        )}
      </form>
    </dialog>
  );
}

function uploadFile(url: string, file: File, mimeType: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", mimeType);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("One file didn't upload. Please try again."));
    };
    xhr.onerror = () => reject(new Error("One file didn't upload. Please check your connection and try again."));
    xhr.send(file);
  });
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

type TurnstileWindow = Window & {
  turnstile?: {
    render: (
      element: HTMLElement,
      options: { sitekey: string; callback: (token: string) => void },
    ) => void;
  };
};
