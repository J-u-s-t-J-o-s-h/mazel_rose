"use client";

import {
  CSSProperties,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SaveTheDateSplash } from "@/components/save-the-date/SaveTheDateSplash";
import { SAVE_THE_DATE_API_PATH } from "@/lib/save-the-date/paths";

const WEDDING_DATE = new Date("2026-11-08T00:00:00-05:00").getTime();

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
};

const EMPTY_COUNTDOWN: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  complete: false,
};

const SECTION_SCROLL_MS_PER_PX = 2.2;
const SECTION_SCROLL_MIN_MS = 1800;
const SECTION_SCROLL_MAX_MS = 3200;

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToElementSlowly(id: string, onDone?: () => void): () => void {
  const target = document.getElementById(id);
  if (!target) {
    onDone?.();
    return () => undefined;
  }

  if (prefersReducedMotion()) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    onDone?.();
    return () => undefined;
  }

  const startY = window.scrollY;
  const endY = target.getBoundingClientRect().top + window.scrollY;
  const distance = endY - startY;
  if (Math.abs(distance) < 2) {
    onDone?.();
    return () => undefined;
  }

  const duration = Math.min(
    SECTION_SCROLL_MAX_MS,
    Math.max(SECTION_SCROLL_MIN_MS, Math.abs(distance) * SECTION_SCROLL_MS_PER_PX),
  );

  let frame = 0;
  let settled = false;
  const startTime = performance.now();

  const stop = () => {
    if (settled) return;
    settled = true;
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", onKeyInterrupt);
    onDone?.();
  };

  const onKeyInterrupt = (event: KeyboardEvent) => {
    if (
      event.key === " " ||
      event.key === "PageDown" ||
      event.key === "PageUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      stop();
    }
  };

  const step = (now: number) => {
    if (settled) return;
    const progress = Math.min((now - startTime) / duration, 1);
    const nextY = startY + distance * easeInOutCubic(progress);
    window.scrollTo({ top: nextY, left: 0, behavior: "instant" });
    if (progress < 1) {
      frame = window.requestAnimationFrame(step);
    } else {
      stop();
    }
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", onKeyInterrupt);
  frame = window.requestAnimationFrame(step);
  return stop;
}

function calculateCountdown(): Countdown {
  const difference = WEDDING_DATE - Date.now();
  if (difference <= 0) return { ...EMPTY_COUNTDOWN, complete: true };

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
    complete: false,
  };
}

function StarOfDavid({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none">
      <path d="M32 8 53 45H11L32 8Z" />
      <path d="m32 56 21-37H11l21 37Z" />
    </svg>
  );
}

function Flourish() {
  return (
    <svg className="flourish" viewBox="0 0 320 34" aria-hidden="true">
      <path d="M4 17h112c17 0 18-13 7-13-8 0-7 12 4 13 15 1 19-12 32-12 12 0 16 13 32 12 11-1 12-13 4-13-11 0-10 13 7 13h116" />
      <path d="m151 17 9-9 9 9-9 9-9-9Z" />
    </svg>
  );
}

const SUCCESS_SPARKS = [
  { dx: -64, dy: -30, delay: 0.08, size: 6 },
  { dx: 58, dy: -38, delay: 0.16, size: 7 },
  { dx: -36, dy: -58, delay: 0.22, size: 5 },
  { dx: 42, dy: -56, delay: 0.28, size: 6 },
  { dx: -78, dy: 8, delay: 0.18, size: 5 },
  { dx: 76, dy: 4, delay: 0.26, size: 6 },
  { dx: -22, dy: -44, delay: 0.34, size: 8 },
  { dx: 18, dy: -62, delay: 0.12, size: 5 },
];

function CountdownDisplay() {
  const [countdown, setCountdown] = useState<Countdown>(EMPTY_COUNTDOWN);

  useEffect(() => {
    const tick = () => setCountdown(calculateCountdown());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (countdown.complete) {
    return <p className="countdown-complete">Today, our forever begins.</p>;
  }

  const units = [
    [countdown.days, "Days"],
    [countdown.hours, "Hours"],
    [countdown.minutes, "Minutes"],
    [countdown.seconds, "Seconds"],
  ] as const;

  return (
    <div className="countdown-grid" aria-label="Countdown to November 8, 2026">
      {units.map(([value, label]) => (
        <div className="countdown-unit" key={label}>
          <span>{String(value).padStart(2, "0")}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function SaveTheDateForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [thanksKey, setThanksKey] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "sent") return;
    successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(SAVE_THE_DATE_API_PATH, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        id?: string;
      };

      if (!response.ok || !result.success || !result.id) {
        throw new Error(result.error || "We couldn’t save your response.");
      }

      form.reset();
      setStatus("sent");
      setThanksKey((key) => key + 1);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="form-section-heading full-field">
        <h3>Your Household</h3>
      </div>

      <div className="field full-field">
        <label htmlFor="guestName">Guest or household name</label>
        <input id="guestName" name="guestName" autoComplete="name" required />
        <small>
          Please enter the name or names as you would like them to appear on
          your formal invitation.
        </small>
      </div>

      <div className="field party-size-field">
        <label htmlFor="partySize">Party size</label>
        <select id="partySize" name="partySize" defaultValue="" required>
          <option value="" disabled>
            Select
          </option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
            <option value={count} key={count}>
              {count}
            </option>
          ))}
        </select>
        <small>How many people are in this household?</small>
      </div>

      <div className="field guest-names-field">
        <label htmlFor="guestNames">Guest names</label>
        <textarea id="guestNames" name="guestNames" rows={3} required />
        <small>Please include everyone who should receive a formal invitation.</small>
      </div>

      <div className="field notes-field full-field">
        <label htmlFor="additionalNotes">
          Additional notes <em>optional</em>
        </label>
        <textarea id="additionalNotes" name="additionalNotes" rows={3} />
        <small>Dietary, accessibility, or anything else we should know.</small>
      </div>

      <div className="address-heading full-field">
        <h3>Mailing address</h3>
        <p>
          Please enter the preferred address for receiving your formal
          invitation.
        </p>
      </div>

      <div className="field full-field">
        <label htmlFor="streetAddress">Street address</label>
        <input
          id="streetAddress"
          name="streetAddress"
          autoComplete="address-line1"
          required
        />
      </div>

      <div className="field full-field">
        <label htmlFor="addressLine2">
          Apartment or suite <em>optional</em>
        </label>
        <input
          id="addressLine2"
          name="addressLine2"
          autoComplete="address-line2"
        />
      </div>

      <div className="field city-field">
        <label htmlFor="city">City</label>
        <input id="city" name="city" autoComplete="address-level2" required />
      </div>

      <div className="field state-field">
        <label htmlFor="state">State</label>
        <input
          id="state"
          name="state"
          autoComplete="address-level1"
          maxLength={2}
          pattern="[A-Za-z]{2}"
          title="Two-letter state"
          required
        />
      </div>

      <div className="field zip-field">
        <label htmlFor="zipCode">ZIP code</label>
        <input
          id="zipCode"
          name="zipCode"
          autoComplete="postal-code"
          inputMode="numeric"
          pattern="[0-9]{5}(-[0-9]{4})?"
          required
        />
      </div>

      <div className="contact-heading full-field">
        <h3>Contact details</h3>
      </div>

      <div className="field full-field">
        <label htmlFor="email">Preferred email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="field full-field">
        <label htmlFor="phone">Preferred phone number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
        />
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-actions full-field">
        <p className="form-privacy">
          Your information will remain private and will not be shared. We’ll
          contact you only when necessary about our wedding—no spam, we promise!
        </p>
        <p className="form-questions">
          Questions? Contact us at{" "}
          <a href="mailto:hello@mazelrose.life">hello@mazelrose.life</a>.
        </p>
        {status === "sent" ? (
          <div
            className="form-success"
            key={thanksKey}
            ref={successRef}
            role="status"
            aria-live="polite"
            tabIndex={-1}
          >
            <div className="form-success-burst" aria-hidden="true">
              {SUCCESS_SPARKS.map((spark, index) => (
                <i
                  key={index}
                  style={
                    {
                      "--dx": `${spark.dx}px`,
                      "--dy": `${spark.dy}px`,
                      "--delay": `${spark.delay}s`,
                      "--size": `${spark.size}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="form-success-mark">
              <div className="form-success-seal" aria-hidden="true">
                <StarOfDavid className="success-star" />
              </div>
              <p className="form-success-script">Thank you</p>
            </div>
            <Flourish />
            <h3 className="form-success-title">Thank you for submitting</h3>
            <p className="form-success-copy">
              We received your information. You can submit again if anything
              changes.
            </p>
          </div>
        ) : null}
        <button
          className="gold-button submit-button"
          disabled={status === "sending"}
          type="submit"
        >
          <span>
            {status === "sending"
              ? "Sending…"
              : status === "sent"
                ? "Submit again"
                : "Submit information"}
          </span>
        </button>
        <p className="form-error" role="alert" aria-live="polite">
          {status === "error" ? errorMessage : ""}
        </p>
      </div>
    </form>
  );
}

type InvitationExperienceProps = {
  forceIntro?: boolean;
};

export function InvitationExperience({
  forceIntro = false,
}: InvitationExperienceProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [introActive, setIntroActive] = useState(true);
  const shellRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const stopScrollRef = useRef<(() => void) | null>(null);
  const scrollingRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      shellRef.current?.style.setProperty("--page-scroll", `${window.scrollY}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      stopScrollRef.current?.();
    };
  }, []);

  function goToSection(id: string, openForm = false) {
    if (scrollingRef.current) return;
    if (openForm) setRsvpOpen(true);
    stopScrollRef.current?.();
    scrollingRef.current = true;
    stopScrollRef.current = scrollToElementSlowly(id, () => {
      scrollingRef.current = false;
    });
  }

  const revealInvitation = useCallback(
    (opts?: { restoreFocus?: boolean }) => {
      setIntroActive(false);
      if (opts?.restoreFocus === false) return;
      window.requestAnimationFrame(() => {
        heroTitleRef.current?.focus({ preventScroll: true });
      });
    },
    [],
  );

  return (
    <>
      <SaveTheDateSplash
        mode="gate"
        forceIntro={forceIntro}
        onDismiss={revealInvitation}
      />

      <main
        ref={shellRef}
        className="invitation-shell"
        aria-hidden={introActive}
        inert={introActive}
      >
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-frame" aria-hidden="true">
          <span className="frame-corner corner-top-left" />
          <span className="frame-corner corner-top-right" />
          <span className="frame-corner corner-bottom-left" />
          <span className="frame-corner corner-bottom-right" />
        </div>

        <div className="hero-content">
          <StarOfDavid className="hero-star" />
          <p className="hero-kicker">Save the Date</p>
          <h1 id="hero-title" ref={heroTitleRef} tabIndex={-1}>
            <span>Tiffany</span>
            <i>&amp;</i>
            <span>Cary</span>
          </h1>
          <Flourish />
          <p className="hero-date">
            <span>November</span>
            <strong>08</strong>
            <span>Two Thousand Twenty-Six</span>
          </p>
          <button
            className="gold-button hero-rsvp"
            type="button"
            onClick={() => goToSection("date")}
          >
            <span>Open Invitation</span>
          </button>
        </div>
      </section>

      <section className="date-reveal paper-section" id="date">
        <div className="ornament-rule" aria-hidden="true">
          <span />
          <StarOfDavid />
          <span />
        </div>
        <p className="eyebrow">With joy in our hearts</p>
        <h2>
          One beautiful day.
          <br />
          A lifetime to follow.
        </h2>
        <p className="invitation-copy">
          We invite you to save the date as we gather beneath the chuppah and
          begin our forever, surrounded by the people we love most.
        </p>
        <div className="date-lockup" aria-label="Sunday, November 8, 2026, Orlando, Florida">
          <span>Sunday</span>
          <strong>November 8</strong>
          <span>2026</span>
          <span className="date-location">Orlando, Florida</span>
        </div>
        <button
          className="navy-button section-continue"
          type="button"
          onClick={() => goToSection("countdown")}
        >
          <span>Continue</span>
        </button>
      </section>

      <section className="countdown-section" id="countdown" aria-labelledby="countdown-title">
        <div className="countdown-inner">
          <p className="eyebrow">Until we say “I do”</p>
          <h2 id="countdown-title">Counting Down to Forever</h2>
          <CountdownDisplay />
          <p className="countdown-note">Formal invitation and wedding details to follow.</p>
          <button
            className="gold-button section-continue"
            type="button"
            onClick={() => goToSection("rsvp", true)}
          >
            <span>Continue</span>
          </button>
        </div>
      </section>

      <section className="rsvp-section paper-section" id="rsvp" aria-labelledby="rsvp-title">
        <div className="rsvp-atmosphere" aria-hidden="true" />
        <div className="rsvp-intro">
          <StarOfDavid className="section-star" />
          <h2 id="rsvp-title">Update Your Contact Information</h2>
          <p>
            We can’t wait to celebrate with you! Please share your household’s
            current and preferred contact information so we can send your formal
            wedding invitation and any essential wedding updates.
          </p>
          {!rsvpOpen && (
            <button className="navy-button" type="button" onClick={() => setRsvpOpen(true)}>
              Open the card
            </button>
          )}
        </div>

        <div
          className={`rsvp-card ${rsvpOpen ? "is-open" : ""}`}
          aria-hidden={!rsvpOpen}
          inert={!rsvpOpen}
        >
          <div className="rsvp-card-inner">
            <div className="card-border" aria-hidden="true" />
            <SaveTheDateForm />
          </div>
        </div>
      </section>

      <footer>
        <Flourish />
        <p className="footer-script">Tiffany &amp; Cary</p>
        <p>November 8, 2026</p>
        <small>Formal invitation &amp; wedding details coming soon</small>
      </footer>
      </main>
    </>
  );
}
