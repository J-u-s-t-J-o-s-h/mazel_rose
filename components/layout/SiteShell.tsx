"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ElfsightBackgroundMusic } from "@/components/layout/ElfsightBackgroundMusic";
import { EnterExperience } from "@/components/layout/EnterExperience";
import { PageTransition } from "@/components/motion/PageTransition";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isStudio = pathname?.startsWith("/studio");
  const isGate = pathname === "/gate";
  const isSaveTheDate = pathname === "/tiffany-cary/save-the-date";

  if (isAdmin || isStudio || isSaveTheDate) {
    return <>{children}</>;
  }

  return (
    <>
      {!isGate ? (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-wine-black"
        >
          Skip to content
        </a>
      ) : null}
      <Header />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      {!isGate ? (
        <>
          <ElfsightBackgroundMusic />
          <EnterExperience />
        </>
      ) : null}
    </>
  );
}
