"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { fieldClassName } from "@/components/rsvp/FormField";

export function GalleryAdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Those details did not match.");
      }
      router.replace("/admin/guest-gallery");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 border border-sterling/60 bg-ivory p-8 shadow-[var(--shadow-soft)]">
        <div>
          <p className="font-script text-3xl text-burgundy">Review</p>
          <h1 className="mt-1 font-serif text-3xl text-wine-black">Guest memories</h1>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
            Sign in to remove a guest upload from the gallery.
          </p>
        </div>
        {!configured ? (
          <p className="text-sm text-burgundy" role="alert">
            Studio sign-in is not configured yet.
          </p>
        ) : null}
        <div>
          <label htmlFor="gallery-admin-email" className="block text-xs uppercase tracking-[0.16em] text-charcoal/70">
            Email
          </label>
          <input
            id="gallery-admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${fieldClassName} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="gallery-admin-password" className="block text-xs uppercase tracking-[0.16em] text-charcoal/70">
            Password
          </label>
          <input
            id="gallery-admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${fieldClassName} mt-2`}
          />
        </div>
        {error ? (
          <p className="text-sm text-burgundy" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={loading || !configured} aria-busy={loading}>
          {loading ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
