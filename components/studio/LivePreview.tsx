"use client";

import { useState } from "react";

export function LivePreview({
  path,
  reloadToken,
}: {
  path: string;
  reloadToken: number;
}) {
  const [width, setWidth] = useState<"full" | "phone">("full");
  const src = `/api/studio/preview?path=${encodeURIComponent(path)}&r=${reloadToken}`;

  return (
    <div className="flex min-h-[32rem] flex-col overflow-hidden border border-parchment bg-parchment/40 lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between gap-3 border-b border-parchment bg-ivory px-3 py-2">
        <p className="text-xs uppercase tracking-[0.16em] text-charcoal/55">
          Live page
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={`text-[11px] uppercase tracking-[0.14em] ${width === "full" ? "text-burgundy" : "text-charcoal/50"}`}
            onClick={() => setWidth("full")}
          >
            Site
          </button>
          <button
            type="button"
            className={`text-[11px] uppercase tracking-[0.14em] ${width === "phone" ? "text-burgundy" : "text-charcoal/50"}`}
            onClick={() => setWidth("phone")}
          >
            Phone
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] uppercase tracking-[0.14em] text-peacock"
          >
            Open tab
          </a>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-wine-black/5 p-3">
        <iframe
          key={reloadToken}
          title="Live website preview"
          src={src}
          className="h-full min-h-[36rem] w-full border-0 bg-ivory shadow-[var(--shadow-soft)] lg:min-h-0"
          style={{ maxWidth: width === "phone" ? "390px" : "100%" }}
        />
      </div>
    </div>
  );
}
