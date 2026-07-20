import { ExternalLink } from "lucide-react";
import type { RegistryItem } from "@/types/content";
import { formatExternalRel } from "@/lib/utils";

const typeLabels: Record<RegistryItem["type"], string> = {
  retailer: "Retailer",
  honeymoon: "Honeymoon",
  cash: "Cash fund",
  charity: "Charity",
};

export function RegistryCard({ item }: { item: RegistryItem }) {
  return (
    <article className="flex h-full flex-col border border-sterling/60 bg-ivory/90 p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.18em] text-cinnamon">
        {typeLabels[item.type]}
      </p>
      <h3 className="mt-3 font-serif text-2xl text-wine-black">{item.name}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/75">
        {item.description}
      </p>
      <a
        href={item.url}
        target="_blank"
        rel={formatExternalRel(item.url)}
        className="mt-6 inline-flex items-center gap-2 self-start border-b border-burgundy pb-1 text-xs uppercase tracking-[0.18em] text-burgundy transition hover:border-cinnamon hover:text-cinnamon"
        aria-label={`Visit ${item.name} registry (opens in a new tab)`}
      >
        View registry <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}
