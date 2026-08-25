"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { restoreAction } from "@/lib/studio/actions";
import type { HistoryRevision } from "@/lib/studio/content";
import type { StudioChange } from "@/lib/studio/types";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function VersionHistory({
  pageKey,
  sectionKey,
  documentId,
  revisions,
  changes,
}: {
  pageKey: string;
  sectionKey: string;
  documentId: string;
  revisions: HistoryRevision[];
  changes: StudioChange[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  async function restore(revisionId: string) {
    setRestoring(revisionId);
    setError(null);
    setMessage(null);
    const result = await restoreAction({
      pageKey,
      sectionKey,
      documentId,
      revisionId,
    });
    setRestoring(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(result.message || "Restored as a draft.");
    router.refresh();
  }

  return (
    <section className="mt-12 border-t border-parchment pt-8">
      <h2 className="font-serif text-2xl text-wine-black">Versions</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Restore creates a new draft. Preview it, then publish when it looks right.
      </p>
      {revisions.length === 0 ? (
        <p className="mt-4 text-sm text-charcoal/55">
          Sanity history was not available for this document yet. Studio still
          records who saved, published, or restored below.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {revisions.map((revision) => (
            <li
              key={revision.revisionId}
              className="flex flex-wrap items-center justify-between gap-3 border border-parchment px-4 py-3"
            >
              <div>
                <p className="text-sm">{formatWhen(revision.timestamp)}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-charcoal/55">
                  {revision.author || "Sanity history"} · {revision.revisionId.slice(0, 12)}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={restoring === revision.revisionId}
                onClick={() => void restore(revision.revisionId)}
              >
                {restoring === revision.revisionId ? "Restoring…" : "Restore"}
              </Button>
            </li>
          ))}
        </ul>
      )}
      {changes.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-[0.16em] text-charcoal/55">
            Who changed this
          </h3>
          <ul className="mt-3 space-y-2">
            {changes.map((change) => (
              <li key={change._id} className="text-sm text-charcoal/80">
                <span className="font-medium text-wine-black">{change.authorName}</span>
                {" · "}
                {change.authorRole}
                {" · "}
                {change.summary}
                {" · "}
                {formatWhen(change.createdAt)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-burgundy" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="mt-4 text-sm text-peacock">{message}</p> : null}
    </section>
  );
}
