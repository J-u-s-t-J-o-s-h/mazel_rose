"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { StudioSession } from "@/lib/studio/types";
import { canManageTeam } from "@/lib/studio/permissions";
import { STUDIO_PAGES } from "@/lib/studio/registry";
import { cn } from "@/lib/utils";

const extraNav = [
  { href: "/studio/comments", label: "Comments" },
  { href: "/studio/activity", label: "Activity" },
  { href: "/studio/account", label: "Account" },
];

export function StudioShell({
  user,
  children,
}: {
  user: StudioSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    router.replace("/studio/login");
    router.refresh();
  }

  return (
    <div className="min-h-full bg-ivory paper-texture text-charcoal">
      <div className="flex min-h-full">
        <aside className="hidden w-64 shrink-0 border-r border-parchment bg-parchment/40 lg:flex lg:flex-col">
          <div className="border-b border-parchment px-6 py-6">
            <p className="font-serif text-2xl lowercase tracking-[0.08em] text-wine-black">
              mazel.rose
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-burgundy">
              Studio
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
              Pages
            </p>
            <Link
              href="/studio"
              className={cn(
                "mb-1 block rounded-sm px-3 py-2 text-sm",
                pathname === "/studio"
                  ? "bg-ivory text-burgundy"
                  : "text-charcoal/80 hover:bg-ivory/70",
              )}
            >
              Overview
            </Link>
            {STUDIO_PAGES.map((page) => {
              const href = `/studio/${page.key}`;
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={page.key}
                  href={href}
                  className={cn(
                    "mb-1 block rounded-sm px-3 py-2 text-sm",
                    active
                      ? "bg-ivory text-burgundy"
                      : "text-charcoal/80 hover:bg-ivory/70",
                  )}
                >
                  {page.title}
                </Link>
              );
            })}
            <p className="mt-6 px-3 pb-2 text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
              Review
            </p>
            {extraNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mb-1 block rounded-sm px-3 py-2 text-sm",
                  pathname === item.href
                    ? "bg-ivory text-burgundy"
                    : "text-charcoal/80 hover:bg-ivory/70",
                )}
              >
                {item.label}
              </Link>
            ))}
            {canManageTeam(user.role) ? (
              <Link
                href="/studio/team"
                className={cn(
                  "mb-1 block rounded-sm px-3 py-2 text-sm",
                  pathname === "/studio/team"
                    ? "bg-ivory text-burgundy"
                    : "text-charcoal/80 hover:bg-ivory/70",
                )}
              >
                Team
              </Link>
            ) : null}
          </nav>
          <div className="border-t border-parchment px-4 py-4">
            <p className="truncate text-sm text-wine-black">{user.name}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-charcoal/55">
              {user.role}
            </p>
            <button
              type="button"
              onClick={() => void logout()}
              className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-burgundy"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-parchment bg-ivory/90 px-4 py-3 lg:px-8">
            <div className="lg:hidden">
              <p className="font-serif text-lg lowercase">mazel.rose studio</p>
              <p className="text-xs uppercase tracking-[0.14em] text-charcoal/55">
                {user.name} · {user.role}
              </p>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.16em] text-charcoal/55">
                Editing room
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.14em]">
              <Link href="/" className="text-peacock hover:text-burgundy">
                View site
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="text-burgundy lg:hidden"
              >
                Sign out
              </button>
            </div>
          </header>
          <nav className="flex gap-2 overflow-x-auto border-b border-parchment px-4 py-2 lg:hidden">
            <Link href="/studio" className="shrink-0 text-xs uppercase tracking-[0.14em] text-burgundy">
              Overview
            </Link>
            {STUDIO_PAGES.map((page) => (
              <Link
                key={page.key}
                href={`/studio/${page.key}`}
                className="shrink-0 text-xs uppercase tracking-[0.14em] text-charcoal/70"
              >
                {page.title}
              </Link>
            ))}
          </nav>
          <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
