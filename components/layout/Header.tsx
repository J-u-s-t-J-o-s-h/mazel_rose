"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Monogram } from "@/components/ui/Monogram";
import { useSite } from "@/components/providers/SiteProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const site = useSite();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/gate" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          overHero
            ? "bg-transparent"
            : "border-b border-parchment/80 bg-ivory/92 backdrop-blur-md shadow-[0_8px_30px_rgba(36,23,27,0.06)]",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label={`${site.brandName} home`}
          >
            <Monogram tone={overHero ? "light" : "brass"} />
            <span
              className={cn(
                "font-serif text-lg tracking-[0.18em] lowercase transition-colors sm:text-xl",
                overHero
                  ? "text-ivory group-hover:text-champagne"
                  : "text-wine-black group-hover:text-burgundy",
              )}
            >
              {site.brandName}
            </span>
          </Link>

          <DesktopNav light={overHero} />

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-sm border lg:hidden",
              overHero
                ? "border-ivory/40 text-ivory hover:border-brass hover:text-champagne"
                : "border-sterling/70 text-wine-black hover:border-burgundy hover:text-burgundy",
            )}
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
