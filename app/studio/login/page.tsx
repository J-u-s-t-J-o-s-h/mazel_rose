import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Monogram } from "@/components/ui/Monogram";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { LoginForm } from "@/components/studio/LoginForm";
import { isStudioConfigured } from "@/lib/studio/clients";
import { getStudioSession } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export default async function StudioLoginPage() {
  const session = await getStudioSession();
  if (session) redirect("/studio");

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ivory px-6 py-20">
      <div className="paper-texture pointer-events-none absolute inset-0" />
      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        <Monogram tone="dark" />
        <h1 className="mt-6 font-serif text-4xl tracking-[0.08em] lowercase text-wine-black sm:text-5xl">
          Studio
        </h1>
        <DecorativeDivider className="mt-5" />
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal/70">
          Sign in to review pages, leave comments, and update the wedding
          website. Guests never see this room.
        </p>
        <div className="mt-8 w-full">
          <Suspense fallback={<p className="text-sm text-charcoal/60">Loading…</p>}>
            <LoginForm configured={isStudioConfigured()} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
