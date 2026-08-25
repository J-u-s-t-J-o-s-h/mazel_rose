import Link from "next/link";
import { notFound } from "next/navigation";
import { listComments } from "@/lib/studio/comments";
import { getDocumentPair, listDocuments } from "@/lib/studio/content";
import { getStudioPage } from "@/lib/studio/registry";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export default async function StudioPageSections({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  await requireStudioUser();
  const { page: pageKey } = await params;
  const page = getStudioPage(pageKey);
  if (!page) notFound();

  const comments = await listComments({ pageKey }).catch(() => []);

  const sections = await Promise.all(
    page.sections.map(async (section) => {
      let hasDraft = false;
      let itemCount: number | null = null;
      try {
        if (section.kind === "singleton" && section.documentId) {
          const pair = await getDocumentPair(section.documentId);
          hasDraft = pair.hasDraft;
        } else {
          const items = await listDocuments(section.documentType);
          itemCount = items.length;
          hasDraft = items.some((item) => item.hasDraft);
        }
      } catch {
        hasDraft = false;
      }
      const openComments = comments.filter(
        (comment) => comment.sectionKey === section.key && !comment.resolved,
      ).length;
      return { section, hasDraft, itemCount, openComments };
    }),
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-burgundy">
        <Link href="/studio">Overview</Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-wine-black">{page.title}</h1>
      <p className="mt-3 text-sm text-charcoal/70">
        Open a section to edit copy, images, links, or SEO fields.
      </p>
      <ul className="mt-8 divide-y divide-parchment border border-parchment">
        {sections.map(({ section, hasDraft, itemCount, openComments }) => (
          <li key={section.key}>
            <Link
              href={`/studio/${page.key}/${section.key}`}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 hover:bg-parchment/30"
            >
              <div>
                <h2 className="font-medium text-wine-black">{section.title}</h2>
                <p className="text-sm text-charcoal/60">
                  {section.kind === "list"
                    ? `${itemCount ?? 0} items`
                    : "Page section"}
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-charcoal/50">
                {hasDraft ? "Draft" : "Published"}
                {openComments ? ` · ${openComments} comments` : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
