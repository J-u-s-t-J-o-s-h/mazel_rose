"use client";

import { useEffect, useMemo, useState } from "react";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { useSite } from "@/components/providers/SiteProvider";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetMs: number): TimeLeft | null {
  const diff = targetMs - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown() {
  const site = useSite();
  const targetMs = useMemo(
    () =>
      new Date(
        process.env.NEXT_PUBLIC_WEDDING_DATE || site.weddingDateIso,
      ).getTime(),
    [site.weddingDateIso],
  );
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tick = () => {
      setTimeLeft(getTimeLeft(targetMs));
      setReady(true);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return (
    <section className="relative overflow-hidden bg-peacock px-6 py-20 text-ivory sm:px-8 sm:py-24">
      <div className="candlelight pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="font-script text-3xl text-champagne sm:text-4xl">
          Until we gather
        </p>
        <h2 className="mt-3 font-serif text-4xl tracking-[0.06em] sm:text-5xl">
          Countdown
        </h2>
        <DecorativeDivider className="mt-5" tone="ivory" />

        {!ready ? (
          <p className="mt-10 text-sm uppercase tracking-[0.2em] text-ivory/70">
            Loading…
          </p>
        ) : timeLeft === null ? (
          <p className="mx-auto mt-10 max-w-xl font-serif text-2xl italic leading-relaxed text-ivory/90 sm:text-3xl">
            The day has arrived—or passed with grace. Thank you for celebrating
            with us.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {(
              [
                ["Days", timeLeft.days],
                ["Hours", timeLeft.hours],
                ["Minutes", timeLeft.minutes],
                ["Seconds", timeLeft.seconds],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="border border-ivory/20 bg-wine-black/20 px-4 py-6 backdrop-blur-sm"
              >
                <p className="font-serif text-4xl text-champagne sm:text-5xl">
                  {String(value).padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ivory/70">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
