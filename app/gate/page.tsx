"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { Button } from "@/components/ui/Button";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { fieldClassName } from "@/components/rsvp/FormField";

function GateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, next }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        next?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to unlock the site.");
      }

      router.replace(data.next || "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to unlock.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md border border-ivory/20 bg-wine-black/30 p-8 backdrop-blur-sm"
    >
      <label
        htmlFor="site-password"
        className="block text-xs uppercase tracking-[0.18em] text-ivory/70"
      >
        Password
      </label>
      <input
        id="site-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className={`${fieldClassName} mt-3 border-ivory/30 bg-transparent text-ivory`}
        autoComplete="current-password"
        required
      />
      {error ? (
        <p className="mt-3 text-sm text-champagne" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="dark"
        className="mt-6 w-full"
        disabled={loading}
      >
        {loading ? "Unlocking…" : "Enter"}
      </Button>
    </form>
  );
}

export default function GatePage() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-peacock px-6 py-20 text-ivory">
      <div className="candlelight pointer-events-none absolute inset-0" />
      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        <Monogram tone="light" />
        <h1 className="mt-6 font-serif text-4xl tracking-[0.08em] lowercase sm:text-5xl">
          mazel.rose
        </h1>
        <DecorativeDivider className="mt-5" tone="ivory" />
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/80">
          This celebration site is currently private. Enter the password shared
          with invited guests.
        </p>
        <div className="mt-8 w-full">
          <Suspense fallback={<p className="text-sm text-ivory/70">Loading…</p>}>
            <GateForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
