import {
  draftId,
  getProductionWriteClient,
  publishedId,
} from "./clients";

export type ContentDocument = Record<string, unknown> & {
  _id: string;
  _type: string;
  _updatedAt?: string;
  _rev?: string;
};

function stripSystemFields(doc: ContentDocument): ContentDocument {
  const next: ContentDocument = { ...doc };
  delete next._rev;
  delete next._updatedAt;
  delete next._createdAt;
  delete next._originalId;
  return next;
}

export async function getDocumentPair(id: string): Promise<{
  published: ContentDocument | null;
  draft: ContentDocument | null;
  current: ContentDocument | null;
  hasDraft: boolean;
}> {
  const client = getProductionWriteClient();
  const pid = publishedId(id);
  const did = draftId(pid);
  const [published, draft] = await Promise.all([
    client.fetch<ContentDocument | null>(`*[_id == $id][0]`, { id: pid }),
    client.fetch<ContentDocument | null>(`*[_id == $id][0]`, { id: did }),
  ]);
  return {
    published,
    draft,
    current: draft || published,
    hasDraft: Boolean(draft),
  };
}

export async function listDocuments(type: string): Promise<
  Array<ContentDocument & { hasDraft: boolean }>
> {
  const client = getProductionWriteClient();
  const rows = await client.fetch<ContentDocument[]>(
    `*[_type == $type] | order(displayOrder asc, _updatedAt desc)`,
    { type },
  );

  const byPublished = new Map<string, ContentDocument & { hasDraft: boolean }>();
  for (const row of rows) {
    const pid = publishedId(row._id);
    const existing = byPublished.get(pid);
    const isDraft = row._id.startsWith("drafts.");
    if (!existing) {
      byPublished.set(pid, {
        ...row,
        _id: pid,
        hasDraft: isDraft,
      });
      continue;
    }
    if (isDraft) {
      byPublished.set(pid, { ...row, _id: pid, hasDraft: true });
    } else {
      byPublished.set(pid, { ...existing, hasDraft: existing.hasDraft });
    }
  }

  return Array.from(byPublished.values());
}

export async function listDraftIds(): Promise<string[]> {
  const client = getProductionWriteClient();
  const ids = await client.fetch<string[]>(
    `*[_id in path("drafts.**")]._id`,
  );
  return ids.map((id) => publishedId(id));
}

export async function saveDraftDocument(
  documentType: string,
  id: string,
  values: Record<string, unknown>,
): Promise<{ id: string; rev?: string }> {
  const client = getProductionWriteClient();
  const pid = publishedId(id);
  const did = draftId(pid);
  const pair = await getDocumentPair(pid);
  const base = pair.current || { _id: pid, _type: documentType };
  const next = stripSystemFields({
    ...base,
    ...values,
    _id: did,
    _type: documentType,
  });
  const result = await client.createOrReplace(next);
  return { id: pid, rev: result._rev as string | undefined };
}

export async function publishDocument(id: string): Promise<void> {
  const client = getProductionWriteClient();
  const pid = publishedId(id);
  const did = draftId(pid);
  const draft = await client.fetch<ContentDocument | null>(`*[_id == $id][0]`, {
    id: did,
  });

  if (draft) {
    const clientWithAction = client as typeof client & {
      action?: (input: {
        actionType: string;
        publishedId: string;
        draftId: string;
      }) => Promise<unknown>;
    };
    if (typeof clientWithAction.action === "function") {
      try {
        await clientWithAction.action({
          actionType: "sanity.action.document.publish",
          publishedId: pid,
          draftId: did,
        });
        return;
      } catch {
        // Fall through to a direct publish write.
      }
    }
    const published = stripSystemFields({ ...draft, _id: pid });
    await client.createOrReplace(published);
    await client.delete(did);
    return;
  }

  const published = await client.fetch<ContentDocument | null>(
    `*[_id == $id][0]`,
    { id: pid },
  );
  if (!published) {
    throw new Error("Nothing to publish yet. Save a draft first.");
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const client = getProductionWriteClient();
  const pid = publishedId(id);
  const did = draftId(pid);
  const results = await Promise.allSettled([
    client.delete(pid),
    client.delete(did),
  ]);
  if (results.every((result) => result.status === "rejected")) {
    throw new Error("Could not delete that item.");
  }
}

export async function createListDraft(
  documentType: string,
  values: Record<string, unknown>,
): Promise<string> {
  const client = getProductionWriteClient();
  const id = crypto.randomUUID();
  await client.create({
    _id: draftId(id),
    _type: documentType,
    showOnWebsite: true,
    displayOrder: 0,
    ...values,
  });
  return id;
}

export async function uploadProductionImage(file: File, alt?: string) {
  const client = getProductionWriteClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type || undefined,
  });
  return {
    _type: "image" as const,
    asset: {
      _type: "reference" as const,
      _ref: asset._id,
    },
    alt: alt || undefined,
  };
}

export type HistoryRevision = {
  revisionId: string;
  timestamp: string;
  author?: string;
};

type TransactionRow = {
  id?: string;
  timestamp?: string;
  author?: string;
};

export async function listDocumentRevisions(
  id: string,
): Promise<HistoryRevision[]> {
  const client = getProductionWriteClient();
  const pid = publishedId(id);
  const dataset = client.config().dataset;
  if (!dataset) return [];

  try {
    const result = await client.request<
      TransactionRow[] | { transactions?: TransactionRow[] }
    >({
      uri: `/data/history/${dataset}/transactions/${encodeURIComponent(pid)}`,
      query: { excludeContent: "true" },
    });
    const rows = Array.isArray(result)
      ? result
      : result.transactions || [];
    return rows
      .map((row) => ({
        revisionId: String(row.id || ""),
        timestamp: String(row.timestamp || ""),
        author: row.author,
      }))
      .filter((row) => row.revisionId)
      .slice(0, 30);
  } catch {
    return [];
  }
}

export async function restoreRevision(
  id: string,
  revisionId: string,
): Promise<void> {
  const client = getProductionWriteClient();
  const pid = publishedId(id);
  const dataset = client.config().dataset;
  if (!dataset) {
    throw new Error("Sanity dataset is not configured.");
  }

  const result = await client.request<
    ContentDocument | { documents?: ContentDocument[] }
  >({
    uri: `/data/history/${dataset}/documents/${encodeURIComponent(pid)}`,
    query: { revision: revisionId },
  });

  const doc = Array.isArray((result as { documents?: ContentDocument[] }).documents)
    ? (result as { documents: ContentDocument[] }).documents[0]
    : (result as ContentDocument);

  if (!doc || !doc._type) {
    throw new Error("Could not load that version.");
  }

  const next = stripSystemFields({
    ...doc,
    _id: draftId(pid),
    _type: doc._type,
  });
  await client.createOrReplace(next);
}
