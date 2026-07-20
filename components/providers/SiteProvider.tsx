"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "@/types/content";
import { siteConfig as fallbackSite } from "@/content/site";

const SiteContext = createContext<SiteConfig>(fallbackSite);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteConfig;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
