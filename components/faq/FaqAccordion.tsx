"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types/content";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

function isEmail(value: string) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
}

function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(EMAIL_PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        isEmail(part) ? (
          <a
            key={`${part}-${index}`}
            href={`mailto:${part}`}
            className="text-burgundy underline decoration-burgundy/40 underline-offset-2 hover:text-cinnamon"
          >
            {part}
          </a>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <div className="mx-auto max-w-3xl divide-y divide-sterling/50 border border-sterling/50 bg-ivory/80">
      {faqs.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div key={item.id}>
            <h2>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-parchment/50 sm:px-6"
              >
                <span className="font-serif text-xl text-wine-black sm:text-2xl">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-burgundy transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-charcoal/80 sm:px-6 sm:text-base">
                    <FaqAnswer text={item.answer} />
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
