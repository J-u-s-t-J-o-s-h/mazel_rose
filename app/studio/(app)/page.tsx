import Link from "next/link";
import { isStudioConfigured } from "@/lib/studio/clients";
import { countOpenCommentsByPage } from "@/lib/studio/comments";
import { listDraftIds } from "@/lib/studio/content";
import { STUDIO_PAGES } from "@/lib/studio/registry";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export default async function StudioHomePage() {
  const user = await requireStudioUser("/studio");
  let commentCounts: Record<string, number> = {};
  let draftIds: string[] = [];
  let loadError: string | null = null;

  if (!isStudioConfigured()) {
    loadError =
      "Studio environment variables are missing. Follow docs/studio-setup.md.";
  } else {
    try {
      [commentCounts, draftIds] = await Promise.all([
        countOpenCommentsByPage(),
        listDraftIds(),
      ]);
    } catch {
      loadError =
        "Could not read Studio or site content. Confirm SANITY_API_WRITE_TOKEN can write to the production dataset. See docs/studio-setup.md.";
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-burgundy">
        Welcome, {user.name}
      </p>
      <h1 className="mt-2 font-serif text-4xl text-wine-black">Overview</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
        Choose a page, edit a section, save a draft, preview, then publish.
        Reviewers can comment without changing the live site.
      </p>
      {loadError ? (
        <p className="mt-6 border border-burgundy/30 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {loadError}
        </p>
      ) : null}
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {STUDIO_PAGES.map((page) => {
          const openComments = commentCounts[page.key] || 0;
          const sectionTypes = new Set(page.sections.map((section) => section.documentId || section.documentType));
          const hasDraft = page.sections.some((section) => {
            if (section.documentId) return draftIds.includes(section.documentId);
            return draftIds.length > 0 && sectionTypes.has(section.documentType);
          });
          return (
            <li key={page.key}>
              <Link
                href={`/studio/${page.key}`}
                className="block border border-parchment bg-ivory p-5 shadow-[var(--shadow-soft)] transition hover:border-burgundy/40"
              >
                <h2 className="font-serif text-2xl text-wine-black">{page.title}</h2>
                <p className="mt-2 text-sm text-charcoal/65">
                  {page.sections.length} editable section
                  {page.sections.length === 1 ? "" : "s"}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-charcoal/50">
                  {hasDraft ? "Drafts pending" : "Published"}
                  {openComments ? ` · ${openComments} open comment${openComments === 1 ? "" : "s"}` : ""}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
