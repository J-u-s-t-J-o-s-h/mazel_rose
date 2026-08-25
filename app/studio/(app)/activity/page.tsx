import Link from "next/link";
import { listChanges } from "@/lib/studio/comments";
import { getStudioPage } from "@/lib/studio/registry";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default async function StudioActivityPage() {
  await requireStudioUser();
  const changes = await listChanges().catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-4xl text-wine-black">Activity</h1>
      <p className="mt-3 text-sm text-charcoal/70">
        Who saved, published, restored, created, or deleted content.
      </p>
      <ul className="mt-8 divide-y divide-parchment border border-parchment">
        {changes.length === 0 ? (
          <li className="px-4 py-6 text-sm text-charcoal/55">No activity recorded yet.</li>
        ) : (
          changes.map((change) => {
            const page = getStudioPage(change.pageKey);
            const href = change.sectionKey
              ? `/studio/${change.pageKey}/${change.sectionKey}${change.itemId ? `/${change.itemId}` : ""}`
              : `/studio/${change.pageKey}`;
            return (
              <li key={change._id} className="px-4 py-4">
                <p className="text-sm text-charcoal/80">
                  <span className="font-medium text-wine-black">{change.authorName}</span>
                  {" · "}
                  {change.authorRole}
                  {" · "}
                  {change.summary}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-charcoal/50">
                  {formatWhen(change.createdAt)} · {page?.title || change.pageKey} · {change.action}
                </p>
                <Link
                  href={href}
                  className="mt-2 inline-block text-xs uppercase tracking-[0.14em] text-burgundy"
                >
                  Open
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
