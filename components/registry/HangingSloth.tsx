"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const SlothCanvas = dynamic(
  () => import("@/components/registry/SlothCanvas").then((module) => module.SlothCanvas),
  { ssr: false },
);

export function HangingSloth() {
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const offscreenRef = useRef(true);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    const sync = () => setPaused(document.hidden || offscreenRef.current);
    const mark = (visible: boolean) => {
      offscreenRef.current = !visible;
      if (visible) setStarted(true);
      sync();
    };
    const rect = node.getBoundingClientRect();
    mark(rect.bottom > -280 && rect.top < window.innerHeight + 280);
    const observer = new IntersectionObserver(
      ([entry]) => {
        mark(entry.isIntersecting);
      },
      { rootMargin: "280px" },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);

  const showCanvas = started && !failed;

  return (
    <div
      ref={frameRef}
      className="relative mx-auto aspect-[4/3] w-full max-w-3xl"
      role="group"
      aria-label="A cartoon sloth hanging from a tree branch."
    >
      <SlothFallback visible={!ready} />
      {showCanvas ? (
        <SlothCanvas
          reducedMotion={Boolean(reducedMotion)}
          paused={paused || Boolean(reducedMotion)}
          onReady={handleReady}
          onError={handleError}
        />
      ) : null}
    </div>
  );
}

function SlothFallback({ visible }: { visible: boolean }) {
  return (
    <Image
      src="/models/sloth-poster.webp"
      alt=""
      fill
      quality={75}
      priority
      sizes="(max-width: 1024px) 100vw, 640px"
      className={`pointer-events-none object-contain transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
    />
  );
}
