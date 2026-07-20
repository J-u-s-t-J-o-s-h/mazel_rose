import { cn } from "@/lib/utils";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";

type PageHeroProps = {
  script?: string;
  title: string;
  description?: string;
  tone?: "teal" | "burgundy" | "sage" | "wine" | "parchment";
  className?: string;
};

const tones = {
  teal: "velvet-glow text-ivory",
  burgundy: "bg-burgundy text-ivory candlelight",
  sage: "bg-sage text-wine-black",
  wine: "bg-wine-black text-ivory",
  parchment: "bg-parchment text-wine-black paper-texture",
};

export function PageHero({
  script,
  title,
  description,
  tone = "teal",
  className,
}: PageHeroProps) {
  const lightText = tone === "teal" || tone === "burgundy" || tone === "wine";

  return (
    <section
      className={cn(
        "relative overflow-hidden px-6 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36",
        tones[tone],
        className,
      )}
    >
      <div className="editorial-frame pointer-events-none absolute inset-4 sm:inset-6" />
      <div className="relative mx-auto max-w-4xl text-center">
        {script ? (
          <p
            className={cn(
              "mb-3 font-script text-3xl sm:text-4xl",
              lightText ? "text-champagne" : "text-burgundy",
            )}
          >
            {script}
          </p>
        ) : null}
        <h1 className="font-serif text-5xl tracking-[0.06em] sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <DecorativeDivider
          className="mt-6"
          tone={lightText ? "ivory" : "brass"}
        />
        {description ? (
          <p
            className={cn(
              "mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg",
              lightText ? "text-ivory/85" : "text-charcoal/80",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
