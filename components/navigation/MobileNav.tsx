"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { Button } from "@/components/ui/Button";
import { useSite } from "@/components/providers/SiteProvider";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const site = useSite();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    onClose();
    // Close only when the route changes; ignore unstable callback identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] lg:hidden"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-peacock velvet-glow" />
          <div className="editorial-frame pointer-events-none absolute inset-3" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex h-full flex-col px-6 pb-10 pt-6"
          >
            <div className="flex items-center justify-between">
              <Monogram tone="light" />
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-ivory/30 text-ivory transition hover:border-brass hover:text-champagne"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p id={titleId} className="sr-only">
              Site navigation
            </p>

            <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto">
              {site.navigation.map((item, index) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.05 + index * 0.04,
                      duration: 0.4,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "block border-b border-ivory/10 py-3 font-serif text-3xl tracking-[0.04em] text-ivory transition hover:text-champagne",
                        active && "text-champagne",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-6">
              <Button href="/rsvp" variant="dark" size="lg" className="w-full">
                Respond to the Invitation
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
