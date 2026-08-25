import Link from "next/link";
import { listComments } from "@/lib/studio/comments";
import { getStudioPage } from "@/lib/studio/registry";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default async function StudioCommentsPage() {
  await requireStudioUser();
  const comments = await listComments().catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-4xl text-wine-black">Comments</h1>
      <p className="mt-3 text-sm text-charcoal/70">
        Every note is tied to a page or section and shows who wrote it.
      </p>
      <ul className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <li className="text-sm text-charcoal/55">No comments yet.</li>
        ) : (
          comments.map((comment) => {
            const page = getStudioPage(comment.pageKey);
            const href = comment.sectionKey
              ? `/studio/${comment.pageKey}/${comment.sectionKey}${comment.itemId ? `/${comment.itemId}` : ""}`
              : `/studio/${comment.pageKey}`;
            return (
              <li key={comment._id} className="border border-parchment px-4 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-charcoal/55">
                  {comment.authorName} · {comment.authorRole} · {formatWhen(comment.createdAt)} ·{" "}
                  {page?.title || comment.pageKey}
                  {comment.resolved ? " · resolved" : ""}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{comment.body}</p>
                <Link
                  href={href}
                  className="mt-3 inline-block text-xs uppercase tracking-[0.14em] text-burgundy"
                >
                  Open section
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
