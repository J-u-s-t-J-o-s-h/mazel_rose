"use client";

import { usePathname } from "next/navigation";
import { AnimatedLink } from "@/components/motion/AnimatedLink";
import { Button } from "@/components/ui/Button";
import { useSite } from "@/components/providers/SiteProvider";
import { cn } from "@/lib/utils";

type DesktopNavProps = {
  light?: boolean;
};

export function DesktopNav({ light }: DesktopNavProps) {
  const site = useSite();
  const pathname = usePathname();
  const items = site.navigation.filter((item) => item.href !== "/rsvp");

  return (
    <nav
      className="hidden items-center gap-6 lg:flex xl:gap-7"
      aria-label="Primary"
    >
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <AnimatedLink
            key={item.href}
            href={item.href}
            active={active}
            className={cn(
              light
                ? active
                  ? "text-champagne"
                  : "text-ivory/90 hover:text-champagne"
                : active
                  ? "text-burgundy"
                  : "text-charcoal/85 hover:text-burgundy",
            )}
          >
            {item.label}
          </AnimatedLink>
        );
      })}
      <Button
        href="/rsvp"
        variant={light ? "dark" : "primary"}
        size="sm"
        className="ml-2"
      >
        RSVP
      </Button>
    </nav>
  );
}
