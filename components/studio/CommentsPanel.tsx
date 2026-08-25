"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClassName } from "@/components/rsvp/FormField";
import { addCommentAction, resolveCommentAction } from "@/lib/studio/actions";
import type { StudioComment } from "@/lib/studio/types";
import { useRouter } from "next/navigation";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function CommentsPanel({
  pageKey,
  sectionKey,
  itemId,
  comments,
}: {
  pageKey: string;
  sectionKey?: string;
  itemId?: string;
  comments: StudioComment[];
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setError(null);
    const result = await addCommentAction({ pageKey, sectionKey, itemId, body });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setBody("");
    router.refresh();
  }

  return (
    <section className="mt-12 border-t border-parchment pt-8">
      <h2 className="font-serif text-2xl text-wine-black">Comments</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Notes stay in Studio. Guests never see them.
      </p>
      <div className="mt-5 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-charcoal/55">No comments on this section yet.</p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment._id}
              className="border border-parchment bg-ivory px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-charcoal/55">
                {comment.authorName} · {comment.authorRole} · {formatWhen(comment.createdAt)}
                {comment.resolved ? " · resolved" : ""}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {comment.body}
              </p>
              <button
                type="button"
                className="mt-3 text-xs uppercase tracking-[0.14em] text-burgundy"
                onClick={async () => {
                  await resolveCommentAction(comment._id, !comment.resolved);
                  router.refresh();
                }}
              >
                {comment.resolved ? "Reopen" : "Resolve"}
              </button>
            </article>
          ))
        )}
      </div>
      <div className="mt-6 space-y-3">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          placeholder="Leave a note about this section…"
          className={fieldClassName}
        />
        {error ? (
          <p className="text-sm text-burgundy" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="button" variant="secondary" disabled={saving} onClick={() => void submit()}>
          {saving ? "Posting…" : "Add comment"}
        </Button>
      </div>
    </section>
  );
}
