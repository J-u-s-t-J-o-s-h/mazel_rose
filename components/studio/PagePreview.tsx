"use client";

import { useState } from "react";
import { LivePreview } from "./LivePreview";

export function PagePreview({ path }: { path: string }) {
  const [reloadToken, setReloadToken] = useState(0);

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="text-xs uppercase tracking-[0.14em] text-peacock"
        onClick={() => setReloadToken((current) => current + 1)}
      >
        Refresh live page
      </button>
      <LivePreview path={path} reloadToken={reloadToken} />
    </div>
  );
}
