"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type AnimatedLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
};

export function AnimatedLink({
  href,
  children,
  className,
  active,
  onClick,
}: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center py-1 text-sm tracking-[0.14em] uppercase transition-colors duration-300",
        active ? "text-burgundy" : "hover:text-burgundy",
        className,
      )}
      aria-current={active ? "page" : undefined}
    >
      <span>{children}</span>
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-px origin-left bg-current transition-transform duration-300 ease-out",
          active ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
