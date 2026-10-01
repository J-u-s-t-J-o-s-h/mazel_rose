"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { fieldClassName } from "@/components/rsvp/FormField";
import { GUEST_GALLERY_LIMITS, validateGuestText } from "@/lib/guest-gallery/limits";
import type { PublicAdvice } from "@/lib/guest-gallery/types";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function UnsolicitedAdvice({ notes }: { notes: PublicAdvice[] }) {
  const router = useRouter();
  const titleId = useId();
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    const scriptId = "turnstile-api";
    const targetId = "advice-turnstile";
    const render = () => {
      const target = document.getElementById(targetId);
      const turnstile = (window as TurnstileWindow).turnstile;
      if (!target || !turnstile || target.childElementCount > 0) return;
      turnstile.render(target, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => setTurnstileToken(token),
      });
    };
    if (document.getElementById(scriptId)) {
      render();
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;
    const text = validateGuestText({ guestName, message });
    if (!text.ok) {
      setFormError(text.error);
      return;
    }
    if (!text.message) {
      setFormError("Please write a note for Tiffany and Cary.");
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setFormError("Please complete the check below, then press Leave your advice.");
      return;
    }

    setSending(true);
    setFormError(null);
    try {
      const response = await fetch("/api/guest-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "advice",
          guestName: text.guestName,
          message: text.message,
          website,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.error || "We couldn't save your note. Please try again.");
      }
      setSucceeded(true);
      setGuestName("");
      setMessage("");
      setWebsite("");
      router.refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We couldn't save your note. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-20 border-t border-ivory/15 pt-16" aria-labelledby={titleId}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-script text-3xl text-champagne">For the couple</p>
        <h2 id={titleId} className="mt-2 font-serif text-4xl text-ivory">
          Unsolicited Advice
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ivory/80">
          Leave Tiffany and Cary a note. No photo and no video, just something funny, wise, or wildly unhelpful.
        </p>
      </div>

      {notes.length ? (
        <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <li key={note.id} className="border border-ivory/20 bg-ivory/10 p-5 text-left">
              <p className="font-serif text-xl leading-relaxed text-ivory">{note.message}</p>
              <p className="mt-4 text-sm text-champagne">{note.guestName}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={onSubmit} className="relative mx-auto mt-10 max-w-xl border border-ivory/20 bg-ivory p-6 text-left text-wine-black sm:p-8" noValidate>
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor="advice-website">Company</label>
          <input
            id="advice-website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {succeeded ? (
          <p className="font-serif text-2xl" role="status">
            Thank you. Your advice is on the page.
          </p>
        ) : null}

        <div className={succeeded ? "mt-6" : undefined}>
          <label htmlFor="advice-name" className="block text-lg">
            Your name
          </label>
          <input
            id="advice-name"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            autoComplete="name"
            maxLength={GUEST_GALLERY_LIMITS.nameMax}
            required
            placeholder="Your name"
            className={`${fieldClassName} mt-2 text-lg`}
          />
        </div>

        <div className="mt-6">
          <label htmlFor="advice-message" className="block text-lg">
            Your advice
          </label>
          <textarea
            id="advice-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={GUEST_GALLERY_LIMITS.messageMax}
            required
            rows={4}
            placeholder="Tell them something they did not ask for."
            className={`${fieldClassName} mt-2 text-lg`}
          />
        </div>

        {turnstileSiteKey ? <div id="advice-turnstile" className="mt-6" /> : null}

        {formError ? (
          <p role="alert" className="mt-4 text-base text-burgundy">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={sending}
          aria-busy={sending}
          className="mt-6 w-full normal-case tracking-normal text-lg"
        >
          {sending ? "Sending…" : "Leave your advice"}
        </Button>
      </form>
    </section>
  );
}

type TurnstileWindow = Window & {
  turnstile?: {
    render: (
      element: HTMLElement,
      options: { sitekey: string; callback: (token: string) => void },
    ) => void;
  };
};
