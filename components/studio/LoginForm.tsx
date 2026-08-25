"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { fieldClassName } from "@/components/rsvp/FormField";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/studio";
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
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to sign in.");
      }
      const destination = next.startsWith("/studio") ? next : "/studio";
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 border border-parchment bg-ivory/90 p-8 shadow-[var(--shadow-soft)]">
      {!configured ? (
        <p className="text-sm text-burgundy" role="alert">
          Studio is not configured yet. Add the environment variables in
          docs/studio-setup.md, then run npm run studio:bootstrap.
        </p>
      ) : null}
      <div>
        <label htmlFor="studio-email" className="block text-xs uppercase tracking-[0.18em] text-charcoal/70">
          Email
        </label>
        <input
          id="studio-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`${fieldClassName} mt-2`}
        />
      </div>
      <div>
        <label htmlFor="studio-password" className="block text-xs uppercase tracking-[0.18em] text-charcoal/70">
          Password
        </label>
        <input
          id="studio-password"
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
      <Button type="submit" className="w-full" disabled={loading || !configured}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
