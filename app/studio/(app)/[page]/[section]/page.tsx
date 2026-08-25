import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentsPanel } from "@/components/studio/CommentsPanel";
import { DocumentForm } from "@/components/studio/DocumentForm";
import { ItemList } from "@/components/studio/ItemList";
import { PagePreview } from "@/components/studio/PagePreview";
import { VersionHistory } from "@/components/studio/VersionHistory";
import { listChangesForDocument, listComments } from "@/lib/studio/comments";
import {
  getDocumentPair,
  listDocumentRevisions,
  listDocuments,
} from "@/lib/studio/content";
import { canEdit, canPublish, canRestore } from "@/lib/studio/permissions";
import { getStudioSection } from "@/lib/studio/registry";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export default async function StudioSectionPage({
  params,
}: {
  params: Promise<{ page: string; section: string }>;
}) {
  const user = await requireStudioUser();
  const { page: pageKey, section: sectionKey } = await params;
  const found = getStudioSection(pageKey, sectionKey);
  if (!found) notFound();
  const { page, section } = found;

  if (section.kind === "list") {
    const items = await listDocuments(section.documentType).catch(() => []);
    return (
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-burgundy">
          <Link href="/studio">Overview</Link>
          {" / "}
          <Link href={`/studio/${page.key}`}>{page.title}</Link>
        </p>
        <h1 className="mt-2 font-serif text-4xl text-wine-black">{section.title}</h1>
        {section.description ? (
          <p className="mt-3 text-sm text-charcoal/70">{section.description}</p>
        ) : null}
        <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(22rem,34rem)_minmax(0,1fr)]">
          <ItemList
            pageKey={page.key}
            section={section}
            canEdit={canEdit(user.role)}
            canDelete={user.role === "owner"}
            items={items.map((item) => ({
              _id: item._id,
              title: String(item[section.titleField] || "Untitled"),
              hasDraft: item.hasDraft,
              visible: item.showOnWebsite !== false,
            }))}
          />
          <PagePreview path={section.previewPath} />
        </div>
        <CommentsPanel
          pageKey={page.key}
          sectionKey={section.key}
          comments={await listComments({ pageKey: page.key, sectionKey: section.key }).catch(() => [])}
        />
      </div>
    );
  }

  const documentId = section.documentId;
  if (!documentId) notFound();

  const pair = await getDocumentPair(documentId).catch(() => ({
    current: null,
    hasDraft: false,
    published: null,
    draft: null,
  }));
  const comments = await listComments({
    pageKey: page.key,
    sectionKey: section.key,
  }).catch(() => []);
  const changes = await listChangesForDocument(documentId).catch(() => []);
  const revisions = canRestore(user.role)
    ? await listDocumentRevisions(documentId).catch(() => [])
    : [];

  const initialValues: Record<string, unknown> = {};
  for (const field of section.fields) {
    initialValues[field.name] = pair.current?.[field.name];
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-burgundy">
        <Link href="/studio">Overview</Link>
        {" / "}
        <Link href={`/studio/${page.key}`}>{page.title}</Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-wine-black">{section.title}</h1>
      {section.description ? (
        <p className="mt-3 text-sm text-charcoal/70">{section.description}</p>
      ) : null}
      <div className="mt-8">
        <DocumentForm
          pageKey={page.key}
          section={section}
          documentId={documentId}
          initialValues={initialValues}
          canEdit={canEdit(user.role)}
          canPublish={canPublish(user.role)}
          hasDraft={pair.hasDraft}
        />
      </div>
      <CommentsPanel
        pageKey={page.key}
        sectionKey={section.key}
        comments={comments}
      />
      {canRestore(user.role) ? (
        <VersionHistory
          pageKey={page.key}
          sectionKey={section.key}
          documentId={documentId}
          revisions={revisions}
          changes={changes}
        />
      ) : (
        <section className="mt-12 border-t border-parchment pt-8">
          <h2 className="font-serif text-2xl text-wine-black">Recent changes</h2>
          {changes.length === 0 ? (
            <p className="mt-3 text-sm text-charcoal/55">No recorded changes yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {changes.map((change) => (
                <li key={change._id} className="text-sm text-charcoal/80">
                  <span className="font-medium text-wine-black">{change.authorName}</span>
                  {" · "}
                  {change.summary}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
