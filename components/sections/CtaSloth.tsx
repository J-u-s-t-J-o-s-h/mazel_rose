"use client";

import dynamic from "next/dynamic";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

const CtaSlothCanvas = dynamic(
  () =>
    import("@/components/sections/CtaSlothCanvas").then(
      (module) => module.CtaSlothCanvas,
    ),
  { ssr: false },
);

type CtaSlothProps = {
  children: ReactNode;
};

export function CtaSloth({ children }: CtaSlothProps) {
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const offscreenRef = useRef(true);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(true);
  const stops = Children.toArray(children);

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
    mark(rect.bottom > -160 && rect.top < window.innerHeight + 160);
    const observer = new IntersectionObserver(
      ([entry]) => mark(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const handleError = useCallback(() => setFailed(true), []);

  return (
    <div
      ref={frameRef}
      className="relative flex flex-col items-center justify-center gap-4 overflow-visible sm:flex-row"
    >
      <div data-sloth-stop="start">{stops[0]}</div>
      <div data-sloth-stop="end">{stops[1]}</div>
      {started && !failed ? (
        <CtaSlothCanvas
          paused={paused}
          reducedMotion={Boolean(reducedMotion)}
          onError={handleError}
        />
      ) : null}
    </div>
  );
}
