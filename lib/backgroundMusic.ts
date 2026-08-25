export const ELFSIGHT_MUSIC_WIDGET_ID =
  "5ca4f9b3-1d91-4c8e-96ae-947ca87fed28";

const WIDGET_SELECTOR = `.elfsight-app-${ELFSIGHT_MUSIC_WIDGET_ID}`;

export function isBackgroundMusicReady(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.querySelector(WIDGET_SELECTOR);
  return Boolean(root?.querySelector('[class*="PlaylistItemComponent"]'));
}

export function startBackgroundMusic(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.querySelector(WIDGET_SELECTOR);
  if (!root) return false;

  const playlistItem = root.querySelector<HTMLElement>(
    '[class*="PlaylistItemComponent"]',
  );
  playlistItem?.click();

  const iframe = root.querySelector("iframe");
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: "playVideo", args: [] }),
    "*",
  );
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: "unMute", args: [] }),
    "*",
  );

  return Boolean(playlistItem || iframe);
}
