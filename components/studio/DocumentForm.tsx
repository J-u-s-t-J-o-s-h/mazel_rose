"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FieldRenderer, type StudioValues } from "./FieldRenderer";
import { LivePreview } from "./LivePreview";
import { publishAction, saveDraftAction } from "@/lib/studio/actions";
import type { StudioSection } from "@/lib/studio/registry";

export function DocumentForm({
  pageKey,
  section,
  documentId,
  initialValues,
  canEdit,
  canPublish,
  hasDraft,
}: {
  pageKey: string;
  section: StudioSection;
  documentId: string;
  initialValues: StudioValues;
  canEdit: boolean;
  canPublish: boolean;
  hasDraft: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<StudioValues>(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const skipAutosave = useRef(true);
  const autosavePaused = useRef(false);
  const savingRef = useRef(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  function setField(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function refreshPreview() {
    setPreviewKey((current) => current + 1);
  }

  async function save(options?: { silent?: boolean }) {
    if (savingRef.current) return false;
    savingRef.current = true;
    if (!options?.silent) {
      setSaving(true);
      setError(null);
      setMessage(null);
    }
    const result = await saveDraftAction({
      pageKey,
      sectionKey: section.key,
      documentId,
      values: valuesRef.current,
      quiet: options?.silent,
    });
    savingRef.current = false;
    if (!options?.silent) setSaving(false);
    if (!result.ok) {
      setError(result.error);
      if (options?.silent) autosavePaused.current = true;
      return false;
    }
    autosavePaused.current = false;
    if (!options?.silent) {
      setMessage("Draft saved. The live page on the right shows unpublished changes.");
      router.refresh();
    }
    refreshPreview();
    return true;
  }

  useEffect(() => {
    if (!canEdit) return;
    if (skipAutosave.current) {
      skipAutosave.current = false;
      return;
    }
    if (autosavePaused.current) return;
    const timer = window.setTimeout(() => {
      void save({ silent: true });
    }, 1400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- save() reads latest values from a ref
  }, [values, canEdit]);

  async function publish() {
    setPublishing(true);
    setError(null);
    setMessage(null);
    const draftResult = canEdit
      ? await saveDraftAction({
          pageKey,
          sectionKey: section.key,
          documentId,
          values: valuesRef.current,
        })
      : { ok: true as const };
    if (!draftResult.ok) {
      setPublishing(false);
      setError(draftResult.error);
      return;
    }
    const result = await publishAction({
      pageKey,
      sectionKey: section.key,
      documentId,
    });
    setPublishing(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(result.message || "Published. Guests will see this version.");
    refreshPreview();
    router.refresh();
  }

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(22rem,34rem)_minmax(0,1fr)]">
      <div className="space-y-6">
        {hasDraft ? (
          <p className="border border-brass/40 bg-champagne/30 px-4 py-3 text-sm text-wine-black">
            This section has unpublished draft changes. Guests still see the last published version until you publish.
          </p>
        ) : null}
        <p className="text-sm text-charcoal/65">
          The page on the right is the real website. Edits save as a private draft after you pause typing, then the preview refreshes.
        </p>
        {section.fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={values[field.name]}
            disabled={!canEdit}
            onChange={(value) => setField(field.name, value)}
          />
        ))}
        {error ? (
          <p className="text-sm text-burgundy" role="alert">
            {error}
          </p>
        ) : null}
        {message ? <p className="text-sm text-peacock">{message}</p> : null}
        <div className="flex flex-wrap gap-3">
          {canEdit ? (
            <Button type="button" variant="secondary" disabled={saving} onClick={() => void save()}>
              {saving ? "Saving…" : "Save draft"}
            </Button>
          ) : null}
          {canPublish ? (
            <Button type="button" disabled={publishing} onClick={() => void publish()}>
              {publishing ? "Publishing…" : "Publish"}
            </Button>
          ) : null}
        </div>
        {!canEdit ? (
          <p className="text-sm text-charcoal/60">
            Reviewer accounts can comment and watch the live page. Editing is limited to Owners and Editors.
          </p>
        ) : null}
      </div>
      <LivePreview path={section.previewPath} reloadToken={previewKey} />
    </div>
  );
}
