"use client";

import { cn } from "@/lib/utils";
import { useSite } from "@/components/providers/SiteProvider";

type MonogramProps = {
  className?: string;
  tone?: "light" | "dark" | "brass";
  showWordmark?: boolean;
};

export function Monogram({
  className,
  tone = "brass",
  showWordmark = false,
}: MonogramProps) {
  const site = useSite();
  const [a, b] = site.coupleNames.initials;
  const tones = {
    light: "text-ivory border-ivory/50",
    dark: "text-wine-black border-burgundy/40",
    brass: "text-brass border-brass/60",
  };

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border font-serif text-lg tracking-[0.12em]",
          tones[tone],
        )}
        aria-hidden="true"
      >
        <span>{a}</span>
        <span className="mx-0.5 text-[0.65em] text-cinnamon">·</span>
        <span>{b}</span>
      </div>
      {showWordmark ? (
        <span className="font-serif text-sm tracking-[0.22em] lowercase">
          {site.brandName}
        </span>
      ) : null}
    </div>
  );
}
