"use client";

import Script from "next/script";
import { ELFSIGHT_MUSIC_WIDGET_ID } from "@/lib/backgroundMusic";

export function ElfsightBackgroundMusic() {
  return (
    <div className="fixed bottom-4 left-4 z-40 w-fit overflow-visible">
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />
      <div className={`elfsight-app-${ELFSIGHT_MUSIC_WIDGET_ID}`} />
    </div>
  );
}
