"use client";

import { useCallback, useState } from "react";
import { set, useClient, type ObjectInputProps } from "sanity";

type ImageValue = {
  _type?: string;
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
  asset?: { _ref?: string; _type?: string };
};

const MAX_EDGE = 4000;
const JPEG_QUALITY = 0.86;

async function prepareImage(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "This photo could not be read. Please use a JPEG or PNG. On iPhone: Settings → Camera → Formats → Most Compatible.",
    );
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not process that photo.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("Could not convert that photo.")),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export function CompatibleImageInput(props: ObjectInputProps) {
  const client = useClient({ apiVersion: "2026-02-01" });
  const [status, setStatus] = useState<string | null>(null);
  const value = props.value as ImageValue | undefined;

  const upload = useCallback(
    async (file: File) => {
      setStatus("Preparing photo…");
      try {
        const prepared = await prepareImage(file);
        setStatus("Uploading photo…");
        const asset = await client.assets.upload("image", prepared, {
          filename: prepared.name,
          contentType: "image/jpeg",
        });
        props.onChange(
          set({
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: value?.alt,
            hotspot: value?.hotspot,
            crop: value?.crop,
          }),
        );
        setStatus("Photo attached. Click Publish to show it on the website.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Upload failed.");
      }
    },
    [client, props, value?.alt, value?.crop, value?.hotspot],
  );

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) void upload(file);
      }}
    >
      <p style={{ margin: "0 0 8px", fontSize: 13, opacity: 0.8 }}>
        Choose a JPEG or PNG, or drop a photo here. Large camera files are
        resized automatically so the upload can finish.
      </p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={props.readOnly}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.currentTarget.value = "";
          if (file) void upload(file);
        }}
      />
      {status ? (
        <p style={{ margin: "8px 0 12px", fontSize: 13 }}>{status}</p>
      ) : (
        <div style={{ height: 12 }} />
      )}
      {value?.asset ? props.renderDefault(props) : null}
    </div>
  );
}
