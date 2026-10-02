"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

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
    primePartySound();
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
      celebrateAdvice();
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
    <section className="mt-14 border-t border-ivory/15 pt-10 sm:mt-20 sm:pt-16" aria-labelledby={titleId}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-script text-2xl text-champagne sm:text-3xl">For the couple</p>
        <h2 id={titleId} className="mt-1 font-serif text-3xl text-ivory sm:mt-2 sm:text-4xl">
          Unsolicited Advice
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ivory/80 sm:mt-4">
          This spot is just for words. Leave Tiffany and Cary something sweet, something silly, or the advice they definitely did not ask for.
        </p>
      </div>

      {notes.length ? (
        <div className="relative mx-auto mt-8 max-w-5xl sm:mt-12">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
            {notes.map((note, index) => (
              <AdviceNote key={note.id} note={note} still={Boolean(reduceMotion)} align={index % 2 === 0 ? "start" : "end"} />
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="relative mx-auto mt-8 max-w-xl border border-ivory/20 bg-ivory p-5 text-left text-wine-black sm:mt-10 sm:p-8" noValidate>
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

const NOTE_PAPERS = ["#f7f1e4", "#f6d9cc", "#f6e7b4", "#e5eddc", "#f8e6ea"] as const;

const CONFETTI_COLORS = ["#ffe14a", "#ff4f8b", "#ff7a29", "#3ee0ff", "#7dff6a", "#c77dff", "#ffffff", "#ff5d73", "#4d7cff"];

function useHoverWave() {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return hover;
}

const WAVE_SECONDS = 1.15;

function AdviceNote({ note, still, align }: { note: PublicAdvice; still: boolean; align: "start" | "end" }) {
  const tilt = still ? 0 : noteTilt(note.id);
  const hoverWave = useHoverWave();
  const filterId = useId().replace(/:/g, "");
  const dxRef = useRef<SVGAnimateElement>(null);
  const dyRef = useRef<SVGAnimateElement>(null);
  const scaleRef = useRef<SVGAnimateElement>(null);
  const pending = useRef<WavePath | null>(null);
  const pointRef = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const wavingRef = useRef(false);
  const [waving, setWaving] = useState(false);
  const paper = NOTE_PAPERS[noteTone(note.id)];

  function play(corner: WavePath) {
    const dx = dxRef.current;
    const dy = dyRef.current;
    const scale = scaleRef.current;
    if (!dx || !dy || !scale) return;
    dx.setAttribute("from", String(corner.fromX));
    dx.setAttribute("to", String(corner.toX));
    dy.setAttribute("from", String(corner.fromY));
    dy.setAttribute("to", String(corner.toY));
    dx.beginElement();
    dy.beginElement();
    scale.beginElement();
  }

  function startWave(el: HTMLDivElement, clientX: number, clientY: number) {
    if (still) return;
    const point = localPoint(el, clientX, clientY);
    const corner = waveFromPoint(point.x, point.y, point.w, point.h);
    if (wavingRef.current) {
      play(corner);
      return;
    }
    pending.current = corner;
    setWaving(true);
  }

  useEffect(() => {
    const scale = scaleRef.current;
    if (!scale) return;
    const finished = () => {
      try {
        scale.getStartTime();
      } catch {
        setWaving(false);
      }
    };
    scale.addEventListener("endEvent", finished);
    return () => scale.removeEventListener("endEvent", finished);
  }, [hoverWave, waving]);

  useEffect(() => {
    wavingRef.current = waving;
  }, [waving]);

  useEffect(() => {
    if (!waving || !pending.current) return;
    const corner = pending.current;
    pending.current = null;
    play(corner);
  }, [waving]);

  useEffect(() => {
    return () => {
      pending.current = null;
    };
  }, []);

  function onPointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    if (!hoverWave || event.pointerType !== "mouse") return;
    startWave(event.currentTarget, event.clientX, event.clientY);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (hoverWave && event.pointerType === "mouse") return;
    if (event.button !== 0) return;
    pointRef.current = { x: event.clientX, y: event.clientY };
    moved.current = false;
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const origin = pointRef.current;
    if (!origin) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (dx * dx + dy * dy > 64) moved.current = true;
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const tapped = pointRef.current !== null && !moved.current;
    pointRef.current = null;
    if (!tapped || (hoverWave && event.pointerType === "mouse")) return;
    startWave(event.currentTarget, event.clientX, event.clientY);
  }

  return (
    <li
      className={`advice-note relative origin-center ${align === "end" ? "ml-auto" : "mr-auto"}`}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
    >
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
          <filter id={filterId} primitiveUnits="userSpaceOnUse" x="-12%" y="-28%" width="124%" height="156%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.018" numOctaves="1" seed="3" result="noise" />
            <feOffset in="noise" dx="0" dy="0" result="moved">
              <animate ref={dxRef} attributeName="dx" from="0" to="0" dur={`${WAVE_SECONDS}s`} begin="indefinite" fill="freeze" calcMode="linear" />
              <animate ref={dyRef} attributeName="dy" from="0" to="0" dur={`${WAVE_SECONDS}s`} begin="indefinite" fill="freeze" calcMode="linear" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="moved" scale="0" xChannelSelector="R" yChannelSelector="G">
              <animate
                ref={scaleRef}
                attributeName="scale"
                values="0;32;38;18;0"
                keyTimes="0;0.24;0.52;0.78;1"
                dur={`${WAVE_SECONDS}s`}
                begin="indefinite"
                fill="freeze"
                calcMode="spline"
                keySplines="0.2 0.8 0.2 1;0.4 0 0.6 1;0.3 0.7 0.2 1;0.4 0 0.2 1"
              />
            </feDisplacementMap>
          </filter>
        </svg>
      <div
        className="paper-texture relative select-none px-5 pb-4 pt-7 text-left text-wine-black shadow-[0_10px_22px_rgba(0,0,0,0.24)] sm:px-6 sm:pb-6 sm:pt-9 sm:shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
        style={{
          backgroundColor: paper,
          filter: waving ? `url(#${filterId})` : undefined,
        }}
        onPointerEnter={onPointerEnter}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointRef.current = null;
        }}
      >
        <span
          className="absolute left-1/2 top-0 h-4 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] bg-ivory/80"
          aria-hidden="true"
        />
        <NoteConfetti id={note.id} />
        <p className="font-serif text-xl leading-snug sm:text-2xl sm:leading-relaxed">{note.message}</p>
        <p className="mt-3 text-right font-script text-2xl text-burgundy sm:mt-5 sm:text-3xl">{note.guestName}</p>
      </div>
    </li>
  );
}

type WavePath = {
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
};

function localPoint(el: HTMLElement, clientX: number, clientY: number) {
  const parent = el.parentElement ?? el;
  const matrix = new DOMMatrix(getComputedStyle(parent).transform);
  const bounds = parent.getBoundingClientRect();
  const local = new DOMPoint(clientX - bounds.left - bounds.width / 2, clientY - bounds.top - bounds.height / 2).matrixTransform(
    matrix.inverse(),
  );
  return {
    x: local.x + parent.clientWidth / 2,
    y: local.y + parent.clientHeight / 2,
    w: el.clientWidth,
    h: el.clientHeight,
  };
}

function waveFromPoint(x: number, y: number, w: number, h: number): WavePath {
  const fromLeft = x < w / 2;
  const fromTop = y < h / 2;
  const signX = fromLeft ? 1 : -1;
  const signY = fromTop ? 1 : -1;
  return {
    fromX: -70 * signX,
    toX: 160 * signX,
    fromY: -48 * signY,
    toY: 110 * signY,
  };
}

function celebrateAdvice() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  launchConfetti();
  playPartyNoise();
}

function launchConfetti() {
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:fixed;inset:0;z-index:80;pointer-events:none;overflow:hidden";

  const flash = document.createElement("span");
  flash.style.cssText =
    "position:absolute;left:50%;top:42%;width:min(70vw,520px);height:min(70vw,520px);border-radius:999px;background:radial-gradient(circle,rgba(255,244,160,0.9),rgba(255,120,170,0) 68%);animation:advice-flash 0.45s ease-out forwards";
  layer.appendChild(flash);

  for (const piece of confettiPieces()) {
    const bit = document.createElement("span");
    bit.style.cssText = [
      "position:absolute",
      "left:50%",
      "top:42%",
      `width:${piece.width}px`,
      `height:${piece.height}px`,
      `margin-left:${-piece.width / 2}px`,
      `margin-top:${-piece.height / 2}px`,
      `background:${piece.color}`,
      `border-radius:${piece.round ? "999px" : "1px"}`,
      `--x:${piece.x}px`,
      `--y:${piece.y}px`,
      `--fall:${piece.fall}px`,
      `--spin:${piece.spin}deg`,
      `animation:advice-burst ${piece.duration}s linear ${piece.delay}s forwards`,
    ].join(";");
    layer.appendChild(bit);
  }

  if (!document.getElementById("advice-confetti-style")) {
    const style = document.createElement("style");
    style.id = "advice-confetti-style";
    style.textContent = [
      "@keyframes advice-burst{",
      "0%{transform:translate3d(0,0,0) rotate(0) scale(.35);opacity:1}",
      "16%{transform:translate3d(var(--x),var(--y),0) rotate(var(--spin)) scale(1);opacity:1}",
      "100%{transform:translate3d(calc(var(--x) * .45),calc(var(--y) + var(--fall)),0) rotate(calc(var(--spin) * 2.2)) scale(.9);opacity:0}",
      "}",
      "@keyframes advice-flash{0%{transform:translate(-50%,-50%) scale(.15);opacity:.7}100%{transform:translate(-50%,-50%) scale(1.7);opacity:0}}",
    ].join("");
    document.head.appendChild(style);
  }

  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 3200);
}

let partyAudio: AudioContext | null = null;

function primePartySound() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const Ctx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  if (!partyAudio) partyAudio = new Ctx();
  if (partyAudio.state === "suspended") void partyAudio.resume();
}

function playPartyNoise() {
  try {
    primePartySound();
    const ctx = partyAudio;
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.42, now);
    master.connect(ctx.destination);

    crackPopper(ctx, master, now);
    crackPopper(ctx, master, now + 0.12);
    blowHorn(ctx, master, now + 0.04);
    [0.06, 0.14, 0.22, 0.32, 0.42].forEach((time, index) => ping(ctx, master, now + time, 880 + index * 220));
  } catch {
    // A missing audio device should not block the saved note.
  }
}

function crackPopper(ctx: AudioContext, master: GainNode, when: number) {
  const length = Math.floor(ctx.sampleRate * 0.25);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2200, when);
  filter.frequency.exponentialRampToValueAtTime(420, when + 0.16);
  filter.Q.value = 0.6;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(0.7, when + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.2);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  noise.start(when);
  noise.stop(when + 0.22);

  const thump = ctx.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(160, when);
  thump.frequency.exponentialRampToValueAtTime(48, when + 0.16);
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.45, when);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.18);
  thump.connect(thumpGain);
  thumpGain.connect(master);
  thump.start(when);
  thump.stop(when + 0.2);
}

function blowHorn(ctx: AudioContext, master: GainNode, when: number) {
  const horn = ctx.createOscillator();
  horn.type = "sawtooth";
  horn.frequency.setValueAtTime(280, when);
  horn.frequency.exponentialRampToValueAtTime(740, when + 0.28);
  horn.frequency.exponentialRampToValueAtTime(980, when + 0.48);
  const rasp = ctx.createOscillator();
  rasp.type = "square";
  rasp.frequency.setValueAtTime(142, when);
  rasp.frequency.exponentialRampToValueAtTime(370, when + 0.28);
  rasp.frequency.exponentialRampToValueAtTime(490, when + 0.48);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, when);
  filter.frequency.exponentialRampToValueAtTime(2200, when + 0.3);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(0.16, when + 0.05);
  gain.gain.setValueAtTime(0.16, when + 0.42);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.62);
  horn.connect(filter);
  rasp.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  horn.start(when);
  rasp.start(when);
  horn.stop(when + 0.64);
  rasp.stop(when + 0.64);
}

function ping(ctx: AudioContext, master: GainNode, when: number, frequency: number) {
  const tone = ctx.createOscillator();
  tone.type = "sine";
  tone.frequency.value = frequency;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(0.1, when + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);
  tone.connect(gain);
  gain.connect(master);
  tone.start(when);
  tone.stop(when + 0.18);
}

function NoteConfetti({ id }: { id: string }) {
  const tone = hashNote(id);
  const bits = [
    { className: "absolute left-2 top-7 h-2.5 w-2.5 rotate-12 bg-burgundy sm:-left-2 sm:top-8 sm:h-3 sm:w-3", hide: tone % 2 === 0 },
    { className: "absolute right-2 bottom-4 h-2.5 w-2.5 rounded-full bg-brass sm:-right-1.5 sm:bottom-6 sm:h-3 sm:w-3", hide: tone % 3 === 0 },
    { className: "absolute right-5 top-1 h-2 w-4 -rotate-6 bg-sage sm:right-6 sm:-top-1.5 sm:h-2.5 sm:w-5", hide: false },
    { className: "absolute bottom-1 left-6 h-2 w-2 rotate-45 bg-cinnamon sm:-bottom-1.5 sm:left-8 sm:h-2.5 sm:w-2.5", hide: tone % 2 === 1 },
  ];
  return (
    <>
      {bits.map((bit) =>
        bit.hide ? null : <span key={bit.className} className={bit.className} aria-hidden="true" />,
      )}
    </>
  );
}

function noteTone(id: string) {
  return hashNote(id) % NOTE_PAPERS.length;
}

function noteTilt(id: string) {
  return ((hashNote(id) % 7) - 3) * 1.15;
}

function hashNote(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function confettiPieces() {
  return Array.from({ length: 160 }, (_, index) => {
    const angle = (index / 160) * Math.PI * 2 + ((index % 5) - 2) * 0.12;
    const power = 260 + (index % 8) * 55;
    const ribbon = index % 7 === 0;
    return {
      x: Math.round(Math.cos(angle) * power),
      y: Math.round(Math.sin(angle) * power * 0.78 - (index % 3 === 0 ? 220 : 120)),
      fall: 220 + (index % 9) * 46,
      spin: (index % 2 === 0 ? 1 : -1) * (280 + (index % 6) * 70),
      delay: index % 9 === 0 ? 0.1 : 0,
      duration: 1.45 + (index % 5) * 0.14,
      width: ribbon ? 7 : 9 + (index % 4) * 4,
      height: ribbon ? 28 : index % 3 === 0 ? 9 + (index % 4) * 3 : 16,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      round: index % 5 === 0,
    };
  });
}

type TurnstileWindow = Window & {
  turnstile?: {
    render: (
      element: HTMLElement,
      options: { sitekey: string; callback: (token: string) => void },
    ) => void;
  };
};
