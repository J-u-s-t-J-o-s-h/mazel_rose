"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSite } from "@/components/providers/SiteProvider";

const sizeClass = {
  sm: "h-16 w-16 sm:h-[4.25rem] sm:w-[4.25rem]",
  md: "h-20 w-20",
  lg: "h-24 w-24",
} as const;

const intrinsicSize = {
  sm: 68,
  md: 80,
  lg: 96,
} as const;

type MonogramProps = {
  className?: string;
  tone?: "light" | "dark" | "brass";
  showWordmark?: boolean;
  size?: keyof typeof sizeClass;
  priority?: boolean;
};

export function Monogram({
  className,
  showWordmark = false,
  size = "sm",
  priority = false,
}: MonogramProps) {
  const site = useSite();
  const pixels = intrinsicSize[size];

  return (
    <div className={cn("inline-flex shrink-0 flex-col items-center gap-2", className)}>
      <Image
        src="/brand/logo.png"
        alt=""
        width={pixels}
        height={pixels}
        quality={90}
        priority={priority}
        className={cn("max-h-full max-w-full object-contain", sizeClass[size])}
      />
      {showWordmark ? (
        <span className="font-serif text-sm tracking-[0.22em] lowercase">
          {site.brandName}
        </span>
      ) : null}
    </div>
  );
}
