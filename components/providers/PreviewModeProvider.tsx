"use client";

import { createContext, useContext } from "react";

/**
 * True when the page is rendered inside Sanity's Presentation preview (draft
 * mode). Scroll-triggered entrance animations are unreliable inside that
 * iframe — an uploaded image can stay stuck in its hidden/clipped initial
 * state — so animation components render their final visible state in preview
 * and keep the motion only for real visitors.
 */
const PreviewModeContext = createContext(false);

export function PreviewModeProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <PreviewModeContext.Provider value={value}>
      {children}
    </PreviewModeContext.Provider>
  );
}

export function useIsPreview() {
  return useContext(PreviewModeContext);
}
