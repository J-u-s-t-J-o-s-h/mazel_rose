"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createItemAction, deleteItemAction } from "@/lib/studio/actions";
import type { StudioSection } from "@/lib/studio/registry";

export function ItemList({
  pageKey,
  section,
  items,
  canEdit,
  canDelete,
}: {
  pageKey: string;
  section: StudioSection;
  items: Array<{ _id: string; title: string; hasDraft: boolean; visible: boolean }>;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function createItem() {
    setCreating(true);
    setError(null);
    const result = await createItemAction({ pageKey, sectionKey: section.key });
    setCreating(false);
    if (!result.ok || !result.id) {
      setError(result.ok ? "Could not create item." : result.error);
      return;
    }
    router.push(`/studio/${pageKey}/${section.key}/${result.id}`);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this item from the website?")) return;
    const result = await deleteItemAction({
      pageKey,
      sectionKey: section.key,
      documentId: id,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-charcoal/65">{items.length} items</p>
        {canEdit ? (
          <Button type="button" size="sm" disabled={creating} onClick={() => void createItem()}>
            {creating ? "Creating…" : "Add item"}
          </Button>
        ) : null}
      </div>
      {error ? (
        <p className="mt-3 text-sm text-burgundy" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="mt-6 divide-y divide-parchment border border-parchment">
        {items.length === 0 ? (
          <li className="px-4 py-6 text-sm text-charcoal/55">No items yet.</li>
        ) : (
          items.map((item) => (
            <li key={item._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <div>
                <Link
                  href={`/studio/${pageKey}/${section.key}/${item._id}`}
                  className="font-medium text-wine-black hover:text-burgundy"
                >
                  {item.title || "Untitled"}
                </Link>
                <p className="text-xs uppercase tracking-[0.14em] text-charcoal/55">
                  {item.visible ? "Visible" : "Hidden"}
                  {item.hasDraft ? " · Draft" : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/studio/${pageKey}/${section.key}/${item._id}`}
                  className="text-xs uppercase tracking-[0.14em] text-peacock"
                >
                  Open
                </Link>
                {canDelete ? (
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.14em] text-burgundy"
                    onClick={() => void remove(item._id)}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
