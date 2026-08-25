"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Monogram } from "@/components/ui/Monogram";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { useSite } from "@/components/providers/SiteProvider";
import { cn } from "@/lib/utils";
import {
  isBackgroundMusicReady,
  startBackgroundMusic,
} from "@/lib/backgroundMusic";

const STORAGE_KEY = "mazel-rose:entered";

export function EnterExperience() {
  const site = useSite();
  const reduceMotion = useReducedMotion();
  const enterRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const copyId = useId();
  const [open, setOpen] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOpen(sessionStorage.getItem(STORAGE_KEY) !== "1");
  }, []);

  const dismiss = useCallback((play: boolean) => {
    if (play) startBackgroundMusic();
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    enterRef.current?.focus();

    const started = Date.now();
    const interval = window.setInterval(() => {
      if (isBackgroundMusicReady() || Date.now() - started > 6000) {
        setReady(true);
        window.clearInterval(interval);
      }
    }, 150);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearInterval(interval);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dismiss, open]);

  useEffect(() => {
    if (open && ready) enterRef.current?.focus();
  }, [open, ready]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute inset-0 bg-peacock velvet-glow" />
          <div className="candlelight pointer-events-none absolute inset-0" />
          <div className="editorial-frame pointer-events-none absolute inset-4 sm:inset-8" />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={copyId}
            className={cn(
              "relative flex h-full items-center justify-center px-6 py-20 text-ivory",
              ready ? "cursor-pointer" : "cursor-wait",
            )}
            onClick={() => {
              if (!ready) return;
              dismiss(true);
            }}
          >
            <div className="flex max-w-lg flex-col items-center text-center">
              <Monogram tone="light" />
              <p className="mt-6 font-script text-4xl text-champagne sm:text-5xl">
                Together
              </p>
              <h2
                id={titleId}
                className="mt-3 font-serif text-4xl tracking-[0.08em] sm:text-5xl"
              >
                {site.coupleNames.display}
              </h2>
              <DecorativeDivider className="mt-5" tone="ivory" />
              <p
                id={copyId}
                className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/80"
              >
                Music will play as you enter. Tap below, or anywhere on this
                screen, to begin.
              </p>
              <button
                ref={enterRef}
                type="button"
                disabled={!ready}
                onClick={(event) => {
                  event.stopPropagation();
                  dismiss(true);
                }}
                className="relative mt-8 inline-flex items-center justify-center rounded-sm border border-ivory/80 bg-ivory px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-wine-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-parchment disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {ready ? "Enter the celebration" : "A moment…"}
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  dismiss(false);
                }}
                className="mt-5 text-xs uppercase tracking-[0.18em] text-ivory/70 transition hover:text-champagne"
              >
                Continue without music
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
