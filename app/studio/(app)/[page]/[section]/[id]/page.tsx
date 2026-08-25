import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentsPanel } from "@/components/studio/CommentsPanel";
import { DocumentForm } from "@/components/studio/DocumentForm";
import { VersionHistory } from "@/components/studio/VersionHistory";
import { listChangesForDocument, listComments } from "@/lib/studio/comments";
import {
  getDocumentPair,
  listDocumentRevisions,
} from "@/lib/studio/content";
import { canEdit, canPublish, canRestore } from "@/lib/studio/permissions";
import { getStudioSection } from "@/lib/studio/registry";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export default async function StudioItemPage({
  params,
}: {
  params: Promise<{ page: string; section: string; id: string }>;
}) {
  const user = await requireStudioUser();
  const { page: pageKey, section: sectionKey, id } = await params;
  const found = getStudioSection(pageKey, sectionKey);
  if (!found || found.section.kind !== "list") notFound();
  const { page, section } = found;

  const pair = await getDocumentPair(id);
  if (!pair.current) notFound();

  const comments = await listComments({
    pageKey: page.key,
    sectionKey: section.key,
    itemId: id,
  }).catch(() => []);
  const changes = await listChangesForDocument(id).catch(() => []);
  const revisions = canRestore(user.role)
    ? await listDocumentRevisions(id).catch(() => [])
    : [];

  const initialValues: Record<string, unknown> = {};
  for (const field of section.fields) {
    initialValues[field.name] = pair.current[field.name];
  }

  const title = String(pair.current[section.titleField] || "Untitled");

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-burgundy">
        <Link href={`/studio/${page.key}`}>{page.title}</Link>
        {" / "}
        <Link href={`/studio/${page.key}/${section.key}`}>{section.title}</Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-wine-black">{title}</h1>
      <div className="mt-8">
        <DocumentForm
          pageKey={page.key}
          section={section}
          documentId={id}
          initialValues={initialValues}
          canEdit={canEdit(user.role)}
          canPublish={canPublish(user.role)}
          hasDraft={pair.hasDraft}
        />
      </div>
      <CommentsPanel
        pageKey={page.key}
        sectionKey={section.key}
        itemId={id}
        comments={comments}
      />
      {canRestore(user.role) ? (
        <VersionHistory
          pageKey={page.key}
          sectionKey={section.key}
          documentId={id}
          revisions={revisions}
          changes={changes}
        />
      ) : null}
    </div>
  );
}
