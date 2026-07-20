import { cn } from "@/lib/utils";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";

type SectionHeadingProps = {
  script?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  dividerTone?: "brass" | "burgundy" | "ivory" | "sage";
};

export function SectionHeading({
  script,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
  dividerTone = "brass",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {script ? (
        <p
          className={cn(
            "mb-3 font-script text-3xl sm:text-4xl",
            tone === "light" ? "text-champagne" : "text-burgundy",
          )}
        >
          {script}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-serif text-4xl leading-tight tracking-[0.04em] sm:text-5xl",
          tone === "light" ? "text-ivory" : "text-wine-black",
        )}
      >
        {title}
      </h2>
      <DecorativeDivider
        className="mt-5"
        tone={tone === "light" ? "ivory" : dividerTone}
      />
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-ivory/85" : "text-charcoal/80",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
