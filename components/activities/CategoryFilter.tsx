"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import { activityCategories } from "@/content/activities";
import type { Activity, ActivityCategory } from "@/types/content";
import { cn, formatExternalRel } from "@/lib/utils";

export function CategoryFilter({ activities }: { activities: Activity[] }) {
  const [active, setActive] = useState<ActivityCategory | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return activities;
    return activities.filter((item) => item.category === active);
  }, [active, activities]);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Activity categories"
      >
        {activityCategories.map((category) => {
          const selected = active === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(category.id)}
              className={cn(
                "min-h-11 border px-4 py-2 text-xs uppercase tracking-[0.16em] transition",
                selected
                  ? "border-burgundy bg-burgundy text-ivory"
                  : "border-sage/50 bg-ivory text-charcoal hover:border-cinnamon hover:text-cinnamon",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden border border-sage/40 bg-ivory shadow-[var(--shadow-soft)]"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.16em] text-cinnamon">
                  {item.category}
                </p>
                {item.priceRange ? (
                  <p className="text-xs tracking-[0.12em] text-charcoal/55">
                    {item.priceRange}
                  </p>
                ) : null}
              </div>
              <h3 className="mt-2 font-serif text-2xl text-wine-black">
                {item.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                {item.description}
              </p>
              {item.recommendation ? (
                <p className="mt-3 text-sm italic text-peacock">
                  {item.recommendation}
                </p>
              ) : null}
              <p className="mt-4 flex items-start gap-2 text-sm text-charcoal/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                <span>
                  {item.address}
                  {item.distance ? ` · ${item.distance}` : ""}
                </span>
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                {item.websiteUrl ? (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel={formatExternalRel(item.websiteUrl)}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-burgundy hover:text-cinnamon"
                    aria-label={`Visit ${item.name} website (opens in a new tab)`}
                  >
                    Website <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                {item.mapUrl ? (
                  <a
                    href={item.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-peacock hover:text-burgundy"
                    aria-label={`View ${item.name} on map (opens in a new tab)`}
                  >
                    Map <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
