"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monogram } from "@/components/ui/Monogram";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { useSite } from "@/components/providers/SiteProvider";

export function Footer() {
  const site = useSite();
  const pathname = usePathname();
  if (pathname === "/gate" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden bg-peacock text-ivory">
      <div className="candlelight pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <Monogram tone="light" />
          <p className="mt-5 font-serif text-3xl tracking-[0.08em] lowercase sm:text-4xl">
            {site.brandName}
          </p>
          <p className="mt-3 font-script text-3xl text-champagne">
            {site.coupleNames.display}
          </p>
          <DecorativeDivider className="mt-5" tone="ivory" />
          <p className="mt-5 text-sm uppercase tracking-[0.22em] text-ivory/75">
            {site.weddingDateDisplay}
          </p>
          <p className="mt-2 text-sm tracking-[0.08em] text-ivory/70">
            {site.location.display}
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-3 text-center sm:grid-cols-3 md:grid-cols-4"
        >
          {site.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.16em] text-ivory/80 transition hover:text-champagne"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-12 border-t border-ivory/15 pt-8 text-center">
          <p className="font-serif text-lg italic text-ivory/85">
            {site.closingStatement}
          </p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-4 inline-block text-sm tracking-[0.12em] text-champagne transition hover:text-ivory"
          >
            {site.contactEmail}
          </a>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ivory/45">
            {site.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
