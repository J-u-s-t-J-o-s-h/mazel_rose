"use client";

import { useState } from "react";
import { memoryAlt } from "@/components/gallery/GuestMemoryLightbox";
import { Button } from "@/components/ui/Button";
import type { PublicMemory } from "@/lib/guest-gallery/types";

type Queue = {
  published: PublicMemory[];
  pending: PublicMemory[];
  rejected: PublicMemory[];
};

export function GalleryModeration({
  reviewer,
  initial,
  loadError,
}: {
  reviewer: string;
  initial: Queue | null;
  loadError: string | null;
}) {
  const [queue, setQueue] = useState<Queue | null>(initial);
  const [error, setError] = useState<string | null>(loadError);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function act(id: string, action: "approve" | "reject" | "delete") {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch("/api/guest-gallery/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = (await response.json()) as Queue & { success?: boolean; error?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.error || "That update didn't save. Please try again.");
      }
      setQueue({
        published: data.published ?? [],
        pending: data.pending ?? [],
        rejected: data.rejected ?? [],
      });
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That update didn't save. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-parchment px-6 py-12 text-wine-black sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="font-script text-3xl text-burgundy">Review</p>
        <h1 className="mt-1 font-serif text-4xl">Guest memories</h1>
        <p className="mt-3 text-sm text-charcoal/70">Signed in as {reviewer}</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal/75">
          These uploads are on the Gallery page. Delete one to remove it.
        </p>

        {error ? (
          <p className="mt-6 text-sm text-burgundy" role="alert">
            {error}
          </p>
        ) : null}

        {queue && queue.published.length === 0 ? (
          <p className="mt-10 border border-sterling/60 bg-ivory px-6 py-10 text-center font-serif text-xl">
            No guest uploads are in the gallery.
          </p>
        ) : null}

        <div className="mt-8 space-y-8">
          {queue?.published.map((memory) => (
            <SubmissionCard
              key={memory.id}
              memory={memory}
              busy={busyId === memory.id}
              confirmingDelete={confirmDeleteId === memory.id}
              onAskDelete={() => setConfirmDeleteId(memory.id)}
              onCancelDelete={() => setConfirmDeleteId(null)}
              onDelete={() => act(memory.id, "delete")}
            />
          ))}
        </div>

        {queue && queue.pending.length ? (
          <section className="mt-16">
            <h2 className="font-serif text-2xl">Still uploading</h2>
            <div className="mt-6 space-y-8">
              {queue.pending.map((memory) => (
            <SubmissionCard
              key={memory.id}
              memory={memory}
              busy={busyId === memory.id}
              confirmingDelete={confirmDeleteId === memory.id}
              onApprove={() => act(memory.id, "approve")}
              onReject={() => act(memory.id, "reject")}
              onAskDelete={() => setConfirmDeleteId(memory.id)}
              onCancelDelete={() => setConfirmDeleteId(null)}
              onDelete={() => act(memory.id, "delete")}
            />
              ))}
            </div>
          </section>
        ) : null}

        {queue && queue.rejected.length ? (
          <section className="mt-16">
            <h2 className="font-serif text-2xl">Not shown</h2>
            <div className="mt-6 space-y-8">
              {queue.rejected.map((memory) => (
                <SubmissionCard
                  key={memory.id}
                  memory={memory}
                  busy={busyId === memory.id}
                  confirmingDelete={confirmDeleteId === memory.id}
                  onAskDelete={() => setConfirmDeleteId(memory.id)}
                  onCancelDelete={() => setConfirmDeleteId(null)}
                  onDelete={() => act(memory.id, "delete")}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function SubmissionCard({
  memory,
  busy,
  confirmingDelete,
  onApprove,
  onReject,
  onAskDelete,
  onCancelDelete,
  onDelete,
}: {
  memory: PublicMemory;
  busy: boolean;
  confirmingDelete: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}) {
  const when = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(new Date(memory.createdAt));

  return (
    <article className="border border-sterling/60 bg-ivory p-5 shadow-[var(--shadow-soft)]">
      <header>
        <h2 className="font-serif text-2xl">{memory.guestName}</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-charcoal/60">
          {memory.media.length ? when : `Unsolicited advice · ${when}`}
        </p>
        {memory.message ? <p className="mt-3 text-base leading-relaxed text-charcoal/80">{memory.message}</p> : null}
      </header>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {memory.media.map((item) => (
          <div key={item.id} className="relative border border-sterling/50">
            {item.mediaType === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={memoryAlt({ ...item, guestName: memory.guestName, message: memory.message })} className="h-auto w-full object-cover" />
            ) : (
              <video
                src={item.url}
                className="h-auto w-full bg-wine-black"
                controls
                playsInline
                preload="metadata"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {onApprove ? (
          <Button type="button" onClick={onApprove} disabled={busy}>
            Approve
          </Button>
        ) : null}
        {onReject ? (
          <Button type="button" variant="secondary" onClick={onReject} disabled={busy}>
            Reject
          </Button>
        ) : null}
        {confirmingDelete ? (
          <>
            <Button type="button" variant="secondary" onClick={onDelete} disabled={busy}>
              Delete permanently
            </Button>
            <button type="button" onClick={onCancelDelete} className="px-3 text-sm text-charcoal/70">
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onAskDelete}
            disabled={busy}
            className="px-3 text-xs uppercase tracking-[0.16em] text-burgundy disabled:opacity-50"
          >
            Delete permanently
          </button>
        )}
      </div>
    </article>
  );
}
