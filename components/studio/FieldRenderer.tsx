"use client";

import { fieldClassName } from "@/components/rsvp/FormField";
import { FormField } from "@/components/rsvp/FormField";
import { uploadImageAction } from "@/lib/studio/actions";
import type { StudioField } from "@/lib/studio/registry";
import { resolveImageUrl } from "@/sanity/lib/image";

export type StudioValues = Record<string, unknown>;

function toDatetimeLocal(value: unknown): string {
  if (!value || typeof value !== "string") return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type ImageValue = {
  _type?: string;
  alt?: string;
  asset?: { _ref?: string };
};

export function FieldRenderer({
  field,
  value,
  disabled,
  onChange,
}: {
  field: StudioField;
  value: unknown;
  disabled: boolean;
  onChange: (value: unknown) => void;
}) {
  const id = `studio-${field.name}`;

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 text-sm text-charcoal">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-burgundy"
        />
        {field.title}
      </label>
    );
  }

  if (field.type === "cta") {
    const cta = (value as { label?: string; href?: string } | null) || {};
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={`${field.title} label`} htmlFor={`${id}-label`}>
          <input
            id={`${id}-label`}
            value={cta.label || ""}
            disabled={disabled}
            onChange={(event) => onChange({ ...cta, label: event.target.value })}
            className={fieldClassName}
          />
        </FormField>
        <FormField label={`${field.title} destination`} htmlFor={`${id}-href`} hint="Use a path like /rsvp or a full https:// link.">
          <input
            id={`${id}-href`}
            value={cta.href || ""}
            disabled={disabled}
            onChange={(event) => onChange({ ...cta, href: event.target.value })}
            className={fieldClassName}
          />
        </FormField>
      </div>
    );
  }

  if (field.type === "initials") {
    const initials = Array.isArray(value) ? value : ["", ""];
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First initial" htmlFor={`${id}-a`}>
          <input
            id={`${id}-a`}
            maxLength={2}
            value={String(initials[0] || "")}
            disabled={disabled}
            onChange={(event) => onChange([event.target.value, initials[1] || ""])}
            className={fieldClassName}
          />
        </FormField>
        <FormField label="Second initial" htmlFor={`${id}-b`}>
          <input
            id={`${id}-b`}
            maxLength={2}
            value={String(initials[1] || "")}
            disabled={disabled}
            onChange={(event) => onChange([initials[0] || "", event.target.value])}
            className={fieldClassName}
          />
        </FormField>
      </div>
    );
  }

  if (field.type === "stringList") {
    return (
      <FormField label={field.title} htmlFor={id} hint={field.hint || "One item per line."}>
        <textarea
          id={id}
          rows={4}
          disabled={disabled}
          value={Array.isArray(value) ? value.join("\n") : ""}
          onChange={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
          className={fieldClassName}
        />
      </FormField>
    );
  }

  if (field.type === "optionList") {
    const keyName = field.optionValueKey || "value";
    const rows = Array.isArray(value)
      ? (value as Array<Record<string, string>>)
      : [];
    return (
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-charcoal/70">
          {field.title}
        </p>
        {rows.map((row, index) => (
          <div key={`${id}-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={row[keyName] || ""}
              disabled={disabled}
              placeholder="Internal key"
              onChange={(event) => {
                const next = rows.slice();
                next[index] = { ...row, [keyName]: event.target.value };
                onChange(next);
              }}
              className={fieldClassName}
            />
            <input
              value={row.label || ""}
              disabled={disabled}
              placeholder="Label shown to guests"
              onChange={(event) => {
                const next = rows.slice();
                next[index] = { ...row, label: event.target.value };
                onChange(next);
              }}
              className={fieldClassName}
            />
            <button
              type="button"
              disabled={disabled}
              className="text-xs uppercase tracking-[0.14em] text-burgundy"
              onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled}
          className="text-xs uppercase tracking-[0.14em] text-peacock"
          onClick={() => onChange([...rows, { [keyName]: "", label: "" }])}
        >
          Add option
        </button>
      </div>
    );
  }

  if (field.type === "image") {
    const image = (value as ImageValue | null) || {};
    const preview = resolveImageUrl(value as never, 800);
    return (
      <FormField label={field.title} htmlFor={id} hint={field.hint}>
        {preview ? (
          // Studio previews can be CMS or Unsplash URLs; a plain img keeps the editor simple.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={image.alt || ""}
            className="mb-3 max-h-48 rounded-sm border border-parchment object-cover"
          />
        ) : (
          <p className="mb-3 text-sm text-charcoal/55">No image yet.</p>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          disabled={disabled}
          className="block w-full text-sm"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const data = new FormData();
            data.set("file", file);
            data.set("alt", image.alt || "");
            const result = await uploadImageAction(data);
            if (!result.ok) {
              window.alert(result.error);
              return;
            }
            onChange({ ...result.image, alt: image.alt || "" });
          }}
        />
        <input
          placeholder="Image description"
          value={image.alt || ""}
          disabled={disabled}
          onChange={(event) => onChange({ ...image, _type: "image", alt: event.target.value })}
          className={`${fieldClassName} mt-3`}
        />
      </FormField>
    );
  }

  if (field.type === "select") {
    return (
      <FormField label={field.title} htmlFor={id} hint={field.hint} required={field.required}>
        <select
          id={id}
          value={String(value || "")}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName}
        >
          <option value="">Choose…</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.title}
            </option>
          ))}
        </select>
      </FormField>
    );
  }

  if (field.type === "text") {
    return (
      <FormField label={field.title} htmlFor={id} hint={field.hint} required={field.required}>
        <textarea
          id={id}
          rows={field.rows || 4}
          maxLength={field.maxLength}
          disabled={disabled}
          value={String(value || "")}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName}
        />
      </FormField>
    );
  }

  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "url"
        ? "url"
        : field.type === "number"
          ? "number"
          : field.type === "datetime"
            ? "datetime-local"
            : "text";

  return (
    <FormField label={field.title} htmlFor={id} hint={field.hint} required={field.required}>
      <input
        id={id}
        type={inputType}
        required={field.required}
        maxLength={field.maxLength}
        disabled={disabled}
        value={
          field.type === "datetime"
            ? toDatetimeLocal(value)
            : field.type === "number"
              ? String(value ?? "")
              : String(value || "")
        }
        onChange={(event) => {
          if (field.type === "number") {
            onChange(event.target.value === "" ? 0 : Number(event.target.value));
            return;
          }
          if (field.type === "datetime") {
            onChange(
              event.target.value
                ? new Date(event.target.value).toISOString()
                : undefined,
            );
            return;
          }
          onChange(event.target.value);
        }}
        className={fieldClassName}
      />
    </FormField>
  );
}
