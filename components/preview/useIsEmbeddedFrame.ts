"use client";

import { useEffect, useState } from "react";

export function useIsEmbeddedFrame() {
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(window.self !== window.top);
  }, []);

  return embedded;
}
