"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   EDIT EVERYTHING HERE
------------------------------------------------------------------ */
const CONFIG = {
  monogram: "T·C",
  returnLine: "Tiffany & Cary",
  eyebrow: "Save the Date",
  nameA: "Tiffany",
  nameB: "Cary",
  dateWeekday: "Sunday,",
  dateRest: "the eighth of November,",
  year: "two thousand twenty-six",
  city: "Orlando, Florida",
  footnote: "Invitation to follow",
  hint: "Tap the envelope",
};

/* Palette ---------------------------------------------------------- */
const T = {
  night: "#0E5C6D",
  nightUp: "#1A7A8C",
  paper: "#C9D4C5",
  paperDim: "#AFBDAB",
  paperEdge: "#8FA08C",
  card: "#F6F2E9",
  ink: "#25352E",
  wine: "#6D2440",
  platinumDeep: "#5F6875",
  platinum: "#9BA6B5",
  platinumLite: "#C8D2E0",
  platinumHot: "#F2F6FB",
};

/* Geometry — landscape A7 proportions -------------------------------- */
const W = 520;
const H = 348;
const FLAP_H = 188;
const CARD_W = 500;
const CARD_H = 324;
const CARD_TOP = 12;
const SLIDE = -250;

const FLIGHT_MS = 1650; // arrival
const LAP_MS = 2600; // one gilding lap, finishes ~1s after touchdown
const GILD_MS = 3050; // when the outline settles to its resting glow

/* How long the whole splash takes to fade away once dismissed. */
const FADE_MS = 600;

/* Shared with the previous intro so a visitor is only gated once per tab. */
const SESSION_KEY = "save_the_date_intro_opened";

/* The envelope silhouette as one continuous closed path:
   top-left -> flap crease -> top-right -> right -> bottom -> left -> close */
const SIL = `M0 0L${W / 2} ${FLAP_H}L${W} 0L${W} ${H}L0 ${H}Z`;

type Phase = "landing" | "sealed" | "opening" | "sliding" | "open";

/** The comet orbs carry their own opacity through a custom property. */
type OrbStyle = CSSProperties & { "--o": number };

export type SaveTheDateSplashMode = "gate" | "page";

/**
 * "pending" is the server pass and the first client render, before
 * sessionStorage can be read. Nothing is rendered until it resolves.
 */
type Decision = "pending" | "play" | "skip";

export type SaveTheDateSplashProps = {
  /**
   * "gate" covers the viewport and can be dismissed into the site once the card
   * is revealed. "page" is the whole Save the Date view and never dismisses.
   */
  mode?: SaveTheDateSplashMode;
  /** Play the splash even if it has already been seen in this tab. */
  forceIntro?: boolean;
  /** Fires once, the moment the card has finished sliding out. */
  onComplete?: () => void;
  /**
   * Fires after the fade-out finishes and the splash has removed itself. Gate
   * mode only. The splash unmounts itself, so the host needs this to know when
   * the underlying page is interactive again.
   */
  onDismiss?: () => void;
};

export function SaveTheDateSplash({
  mode = "gate",
  forceIntro = false,
  onComplete,
  onDismiss,
}: SaveTheDateSplashProps = {}) {
  const [decision, setDecision] = useState<Decision>("pending");
  const [phase, setPhase] = useState<Phase>("landing");
  const [gilded, setGilded] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const timers = useRef<number[]>([]);
  const exitTimer = useRef<number | null>(null);
  const completeFired = useRef(false);
  const skipNotified = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onDismissRef = useRef(onDismiss);

  const isGate = mode === "gate";
  const active = decision === "play";

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const at = (ms: number, fn: () => void) =>
    timers.current.push(window.setTimeout(fn, ms));

  // sessionStorage is only ever touched after mount, so the server pass and the
  // first client render agree on rendering nothing at all.
  useEffect(() => {
    if (!isGate || forceIntro) {
      queueMicrotask(() => setDecision("play"));
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      // Storage can be unavailable; playing the splash is the safe fallback.
    }

    if (alreadySeen) {
      queueMicrotask(() => {
        setDecision("skip");
        if (!skipNotified.current) {
          skipNotified.current = true;
          onDismissRef.current?.();
        }
      });
      return;
    }

    try {
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // Non-fatal: the splash simply plays again on the next load.
    }

    queueMicrotask(() => setDecision("play"));
  }, [isGate, forceIntro]);

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      // Deferred so the reduced-motion branch does not setState synchronously
      // inside the effect body; a microtask still lands before first paint.
      queueMicrotask(() => {
        setPhase("sealed");
        setGilded(true);
      });
    } else {
      at(FLIGHT_MS, () => setPhase("sealed"));
      at(GILD_MS, () => setGilded(true));
    }
    return () => timers.current.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const open = () => {
    if (phase !== "sealed") return;
    if (reduced) {
      setFlapBehind(true);
      setPhase("open");
      return;
    }
    setPhase("opening");
    at(520, () => setFlapBehind(true));
    at(900, () => setPhase("sliding"));
    at(2000, () => setPhase("open"));
  };

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setFlapBehind(false);
    setGilded(true);
    setPhase("sealed");
  };

  const inFlight = phase === "landing";
  const isOut = phase === "sliding" || phase === "open";
  const isOpen = phase === "open";
  const flapOpen = phase === "opening" || isOut;
  const sparkleOn = phase === "landing" || phase === "sealed";
  const dur = (ms: number) => (reduced ? "0ms" : ms + "ms");

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onDismissRef.current = onDismiss;
  }, [onComplete, onDismiss]);

  useEffect(() => {
    if (!isOpen || completeFired.current) return;
    completeFired.current = true;
    onCompleteRef.current?.();
  }, [isOpen]);

  const dismiss = useCallback(() => {
    if (!isGate || exitTimer.current !== null) return;

    setLeaving(true);
    exitTimer.current = window.setTimeout(
      () => {
        setGone(true);
        onDismissRef.current?.();
      },
      reduced ? 0 : FADE_MS,
    );
  }, [isGate, reduced]);

  // Gate mode owns the viewport, so the page behind it must not scroll.
  useEffect(() => {
    if (!isGate || !active || gone) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isGate, active, gone]);

  useEffect(
    () => () => {
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    },
    [],
  );

  if (!active || gone) return null;

  return (
    <div
      className={
        "stdRoot " +
        (isGate ? "stdGate" : "stdPage") +
        (leaving ? " stdLeaving" : "")
      }
      style={isGate ? { transitionDuration: dur(FADE_MS) } : undefined}
      role={isGate ? "dialog" : undefined}
      aria-modal={isGate ? true : undefined}
      aria-label={
        isGate ? `${CONFIG.nameA} and ${CONFIG.nameB} — ${CONFIG.eyebrow}` : undefined
      }
    >
      <style>{CSS}</style>

      <div className="stdVignette" aria-hidden="true" />

      {isGate && (
        <button className="stdReset stdSkip" type="button" onClick={dismiss}>
          Skip
        </button>
      )}

      {isOpen && !reduced && (
        <div className="stdMotes" aria-hidden="true">
          {MOTES.map((m, i) => (
            <span
              key={i}
              style={{
                left: m.l + "%",
                animationDelay: m.d + "s",
                animationDuration: m.u + "s",
                width: m.s + "px",
                height: m.s + "px",
              }}
            />
          ))}
        </div>
      )}

      <div className="stdScale">
        <div
          className="stdStage"
          style={{
            transform: `translateY(${isOpen ? 118 : 0}px)`,
            transitionDuration: dur(900),
          }}
        >
          {inFlight && !reduced && (
            <div className="stdTrail" aria-hidden="true">
              {TRAIL.map((p, i) => (
                <span
                  key={i}
                  style={{
                    left: p.x + "%",
                    top: p.y + "%",
                    width: p.s + "px",
                    height: p.s + "px",
                    animationDelay: p.d + "ms",
                  }}
                />
              ))}
            </div>
          )}

          <div className={"stdFlight" + (reduced ? " stdNoFly" : "")}>
            {/* ---------------- ENVELOPE ---------------- */}
            <div
              className="stdEnvelope"
              role="button"
              tabIndex={phase === "sealed" ? 0 : -1}
              aria-label="Open the save the date envelope"
              onClick={open}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open();
                }
              }}
              style={{
                cursor: phase === "sealed" ? "pointer" : "default",
                // No opacity fade here: .stdCard is a child of the envelope, so
                // fading the envelope would fade the revealed card away too.
                transform: `translateY(${isOpen ? 34 : 0}px) scale(${isOpen ? 0.97 : 1})`,
                transitionDuration: dur(850),
                pointerEvents: phase === "sealed" ? "auto" : "none",
              }}
            >
              <div className="stdBack" />

              <div
                className="stdCard"
                style={{
                  transform: `translateY(${isOut ? SLIDE : 0}px)`,
                  transitionDuration: dur(1200),
                  boxShadow: isOut
                    ? "0 40px 70px -30px rgba(0,0,0,.75), 0 2px 0 rgba(255,255,255,.5) inset"
                    : "0 6px 14px -8px rgba(0,0,0,.6)",
                }}
              >
                <div className="stdCardRule" />

                <div className="stdCardLeft">
                  <p className="stdEyebrow">{CONFIG.eyebrow}</p>
                  <h1 className="stdNames">
                    <span>{CONFIG.nameA}</span>
                    <em>&amp;</em>
                    <span>{CONFIG.nameB}</span>
                  </h1>
                </div>

                <div className="stdSpine" aria-hidden="true">
                  <i />
                  <span>✦</span>
                  <i />
                </div>

                <div className="stdCardRight">
                  <p className="stdDate">
                    <span>{CONFIG.dateWeekday}</span>
                    <span>{CONFIG.dateRest}</span>
                  </p>
                  <p className="stdYear">{CONFIG.year}</p>
                  {CONFIG.city && <p className="stdCity">{CONFIG.city}</p>}
                  <p className="stdFoot">{CONFIG.footnote}</p>
                </div>
              </div>

              <div className="stdPocket" />

              <div
                className="stdFlap"
                style={{
                  transform: `rotateX(${flapOpen ? -178 : 0}deg)`,
                  transitionDuration: dur(1000),
                  zIndex: flapBehind ? 1 : 6,
                }}
              >
                <div className="stdFlapFace stdFlapOuter">
                  <span className="stdReturn">{CONFIG.returnLine}</span>
                </div>
                <div className="stdFlapFace stdFlapLiner" />
              </div>

              <div
                className="stdSeal"
                style={{
                  opacity: flapOpen ? 0 : 1,
                  transform: `translateX(-50%) scale(${flapOpen ? 1.22 : 1})`,
                  transitionDuration: dur(320),
                  zIndex: flapBehind ? 0 : 7,
                }}
              >
                <span>{CONFIG.monogram}</span>
              </div>
            </div>

            {/* ---------- gilded silhouette: one lap, then a resting glow ---------- */}
            <svg
              className={"stdSil" + (gilded ? " stdSilRest" : "")}
              viewBox={`0 0 ${W} ${H}`}
              width={W}
              height={H}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="stdGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={T.platinumDeep} />
                  <stop offset="22%" stopColor={T.platinumLite} />
                  <stop offset="40%" stopColor={T.platinumHot} />
                  <stop offset="58%" stopColor={T.platinum} />
                  <stop offset="78%" stopColor={T.platinumLite} />
                  <stop offset="100%" stopColor={T.platinumDeep} />
                </linearGradient>
                <filter
                  id="stdBloom"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>

              {/* the metallic line, drawn in behind the comet */}
              <path
                className="stdSilBase"
                d={SIL}
                pathLength="1000"
                style={{
                  opacity: !sparkleOn ? 0 : gilded ? 0.34 : 0.9,
                  transitionDuration: dur(gilded ? 1100 : 600),
                }}
              />
              {/* soft halo on the travelling segment */}
              <path
                className="stdSilBloom"
                d={SIL}
                pathLength="1000"
                filter="url(#stdBloom)"
              />
              {/* the bright segment itself */}
              <path className="stdSilSweep" d={SIL} pathLength="1000" />
            </svg>

            {/* comet head + tail, one lap only */}
            <div
              className="stdOrbs"
              aria-hidden="true"
              style={{ opacity: sparkleOn ? 1 : 0, transitionDuration: dur(500) }}
            >
              {ORBS.map((o, i) => (
                <i
                  key={i}
                  style={
                    {
                      width: o.s + "px",
                      height: o.s + "px",
                      animationDelay: o.d + "ms",
                      "--o": o.o,
                    } as OrbStyle
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="stdHint" style={{ opacity: phase === "sealed" ? 1 : 0 }}>
        {CONFIG.hint}
      </p>

      <div className="stdActions">
        <button
          className="stdReset"
          type="button"
          onClick={reset}
          disabled={!isOpen}
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          Seal it again
        </button>

        {isGate && (
          <button
            className="stdReset stdContinue"
            type="button"
            onClick={dismiss}
            disabled={!isOpen}
            style={{
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? "auto" : "none",
            }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

/* a single comet: head plus a tapering tail that lags behind it */
const ORBS = Array.from({ length: 8 }, (_, i) => ({
  s: 10 - i * 0.95,
  o: 1 - i * 0.11,
  d: i * 44,
}));

const TRAIL = Array.from({ length: 18 }, (_, i) => {
  const t = i / 17;
  const j = (n: number) => Math.sin(i * n) * 5;
  return {
    x: -78 + t * 128 + j(2.1),
    y: -148 + t * 198 + j(3.7),
    s: 3 + ((i * 7) % 5),
    d: Math.round(t * 1180),
  };
});

const MOTES = [
  { l: 12, d: 0.1, u: 7.5, s: 3 },
  { l: 22, d: 1.4, u: 9, s: 2 },
  { l: 31, d: 0.6, u: 8.2, s: 4 },
  { l: 44, d: 2.1, u: 7, s: 2 },
  { l: 52, d: 0.9, u: 10, s: 3 },
  { l: 63, d: 1.8, u: 8.6, s: 2 },
  { l: 71, d: 0.3, u: 9.4, s: 4 },
  { l: 79, d: 2.6, u: 7.8, s: 2 },
  { l: 88, d: 1.1, u: 9.9, s: 3 },
  { l: 6, d: 3.0, u: 8.4, s: 2 },
  { l: 37, d: 3.4, u: 9.2, s: 3 },
  { l: 94, d: 2.2, u: 7.2, s: 2 },
];

const CSS = `
.stdRoot{
  position:relative; min-height:100vh; width:100%; overflow:hidden;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:radial-gradient(120% 80% at 50% 0%, ${T.nightUp} 0%, ${T.night} 55%, #0a4552 100%);
  font-family:var(--font-jost),system-ui,sans-serif; padding:32px 12px 0;
}

/* gate: an overlay above everything else, faded out on dismiss.
   page: the ordinary in-flow view, which never dismisses. */
.stdGate{
  position:fixed; inset:0; z-index:200;
  min-height:100svh; opacity:1;
  transition-property:opacity; transition-timing-function:ease;
}
.stdLeaving{ opacity:0; }
.stdVignette{
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(70% 55% at 50% 44%, rgba(200,210,224,.10), transparent 70%);
}
.stdScale{
  transform-origin:center;
  transform:scale(min(1, calc((100vw - 24px) / ${W}px)));
}
.stdStage{
  position:relative; width:${W}px; height:${H}px;
  perspective:1900px; perspective-origin:50% 26%;
  transition:transform cubic-bezier(.32,.72,.24,1);
}

/* ---- flight ---- */
.stdFlight{
  position:absolute; inset:0;
  animation:stdFly ${FLIGHT_MS}ms cubic-bezier(.2,.62,.3,1) both;
}
.stdNoFly{ animation:none; }
@keyframes stdFly{
  0%   { transform:translate3d(-78%,-148%,-700px) rotate(-27deg) scale(.42); opacity:0 }
  14%  { opacity:1 }
  68%  { transform:translate3d(2.5%,4%,0) rotate(3.2deg) scale(1.045) }
  84%  { transform:translate3d(-1%,-1.4%,0) rotate(-1.4deg) scale(.988) }
  93%  { transform:translate3d(.4%,.5%,0) rotate(.5deg) scale(1.004) }
  100% { transform:translate3d(0,0,0) rotate(0deg) scale(1) }
}

.stdEnvelope{
  position:absolute; inset:0; transform-style:preserve-3d;
  transition:opacity ease, transform cubic-bezier(.4,0,.6,1);
  filter:drop-shadow(0 46px 56px rgba(0,0,0,.55));
  -webkit-tap-highlight-color:transparent;
}
.stdEnvelope:focus-visible{ outline:2px solid ${T.platinum}; outline-offset:18px; }

.stdBack{
  position:absolute; inset:0; z-index:0;
  background:linear-gradient(170deg, ${T.paperDim}, ${T.paperEdge});
}
.stdPocket{
  position:absolute; inset:0; z-index:3;
  background:linear-gradient(200deg, ${T.paper} 0%, ${T.paperDim} 70%, ${T.paperEdge} 100%);
  clip-path:polygon(0 0, 50% ${(FLAP_H / H) * 100}%, 100% 0, 100% 100%, 0 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35);
}

.stdFlap{
  position:absolute; top:0; left:0; width:${W}px; height:${FLAP_H}px;
  transform-origin:top center; transform-style:preserve-3d;
  transition:transform cubic-bezier(.62,.02,.24,1);
}
.stdFlapFace{
  position:absolute; inset:0; backface-visibility:hidden;
  clip-path:polygon(0 0, 100% 0, 50% 100%);
}
.stdFlapOuter{ background:linear-gradient(180deg, ${T.paper}, ${T.paperDim}); }
.stdFlapLiner{
  transform:rotateY(180deg);
  background:
    repeating-linear-gradient(46deg, rgba(109,36,64,.16) 0 2px, transparent 2px 11px),
    linear-gradient(180deg,#EDE9DE,#DCD8C9);
}
.stdReturn{
  position:absolute; top:34px; left:0; right:0; text-align:center;
  font-size:14.0625px; font-weight:500; letter-spacing:.34em; text-transform:uppercase; color:rgba(37,53,46,.5);
}

.stdSeal{
  position:absolute; left:50%; top:${FLAP_H - 34}px; width:68px; height:68px;
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  background:radial-gradient(circle at 34% 28%, #9A3A57, ${T.wine} 48%, #4A1729 100%);
  box-shadow:0 4px 10px -3px rgba(0,0,0,.6), inset 0 -2px 6px rgba(0,0,0,.35);
  transition:opacity ease, transform cubic-bezier(.3,1.4,.5,1);
}
.stdSeal::after{
  content:""; position:absolute; inset:5px; border-radius:50%;
  border:1px solid rgba(200,210,224,.35);
}
.stdSeal span{ font-family:var(--font-italiana),serif; font-size:31.25px; color:${T.platinumLite}; letter-spacing:.03em; }

/* ---- gilded silhouette ---- */
.stdSil{
  position:absolute; left:0; top:0; z-index:9; overflow:visible;
  pointer-events:none; fill:none;
}
.stdSilBase{
  stroke:url(#stdGold); stroke-width:1.4; stroke-linejoin:round;
  stroke-dasharray:1000; opacity:0;
  transition-property:opacity; transition-timing-function:ease;
  animation:stdDraw ${LAP_MS}ms linear both;
}
.stdSilRest .stdSilBase{
  stroke-width:1.6;
  filter:drop-shadow(0 0 4px rgba(200,210,224,.65));
}
.stdSilBloom{
  stroke:${T.platinumLite}; stroke-width:7; stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:170 830; opacity:0;
  animation:stdLapSoft ${LAP_MS}ms linear both;
}
.stdSilSweep{
  stroke:${T.platinumHot}; stroke-width:2.6; stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:150 850; opacity:0;
  animation:stdLap ${LAP_MS}ms linear both;
}
@keyframes stdDraw{
  from{ stroke-dashoffset:1000 }
  to  { stroke-dashoffset:0 }
}
@keyframes stdLap{
  0%  { stroke-dashoffset:1000; opacity:0 }
  7%  { opacity:1 }
  84% { opacity:1 }
  100%{ stroke-dashoffset:0; opacity:0 }
}
@keyframes stdLapSoft{
  0%  { stroke-dashoffset:1000; opacity:0 }
  7%  { opacity:.5 }
  84% { opacity:.5 }
  100%{ stroke-dashoffset:0; opacity:0 }
}

/* ---- comet head riding the silhouette, one lap ---- */
.stdOrbs{ position:absolute; left:0; top:0; width:${W}px; height:${H}px; z-index:10; pointer-events:none; transition:opacity ease; }
.stdOrbs i{
  position:absolute; left:0; top:0; display:block; border-radius:50%; opacity:0;
  background:radial-gradient(circle, #FBFDFF 0 28%, ${T.platinumHot} 48%, ${T.platinumLite} 70%, rgba(200,210,224,0) 100%);
  filter:drop-shadow(0 0 6px rgba(242,246,251,.95));
  offset-path:path("${SIL}"); offset-rotate:0deg; offset-anchor:center;
  animation:stdOrbit ${LAP_MS}ms linear both;
}
@keyframes stdOrbit{
  0%  { offset-distance:0%; opacity:0 }
  5%  { opacity:var(--o) }
  86% { opacity:var(--o) }
  100%{ offset-distance:100%; opacity:0 }
}
@supports not (offset-path: path("M0 0L1 1")){ .stdOrbs{ display:none } }

/* ---- comet trail on arrival ---- */
.stdTrail{ position:absolute; inset:0; z-index:11; pointer-events:none; }
.stdTrail span{
  position:absolute; display:block; border-radius:50%;
  background:radial-gradient(circle, ${T.platinumHot} 0 35%, ${T.platinumLite} 55%, rgba(200,210,224,0) 100%);
  filter:drop-shadow(0 0 6px rgba(200,210,224,.9));
  opacity:0; animation:stdSpark 950ms ease-out both;
}
@keyframes stdSpark{
  0%{ opacity:0; transform:scale(.4) }
  18%{ opacity:1; transform:scale(1.15) }
  100%{ opacity:0; transform:scale(.2) translate(14px, 18px) }
}

/* ---- landscape card ---- */
.stdCard{
  position:absolute; z-index:2; left:${(W - CARD_W) / 2}px; top:${CARD_TOP}px;
  width:${CARD_W}px; height:${CARD_H}px; border-radius:2px;
  background:linear-gradient(175deg, #FBF8F1, ${T.card} 60%, #EDE7DA);
  transition:transform cubic-bezier(.5,0,.18,1), box-shadow ease;
  display:flex; align-items:center; justify-content:center; gap:16px;
  padding:26px 24px; color:${T.ink};
}
.stdCardRule{ position:absolute; inset:12px; border:1px solid rgba(155,166,181,.42); pointer-events:none; }
.stdCardLeft{ flex:0 1 auto; text-align:center; padding-inline:4px 8px; }
.stdCardRight{ flex:1 1 auto; min-width:0; text-align:left; padding-inline:8px 4px; }
.stdEyebrow{
  margin:0 0 10px; font-size:11px; font-weight:400; letter-spacing:.28em;
  text-transform:uppercase; color:rgba(37,53,46,.6); white-space:nowrap;
}
.stdNames{ margin:0; font-family:var(--font-italiana),serif; font-weight:400; line-height:.94; text-align:center; }
.stdNames span{ display:block; font-size:40px; letter-spacing:.04em; text-transform:uppercase; white-space:nowrap; }
.stdNames em{
  display:block; font-family:var(--font-cormorant),serif; font-style:italic;
  font-size:26px; letter-spacing:0; color:${T.wine}; margin:6px 0 4px; line-height:1;
}
.stdSpine{ align-self:stretch; display:flex; flex-direction:column; align-items:center; gap:8px; padding:10px 0; flex:0 0 auto; }
.stdSpine i{ flex:1; width:1px; background:rgba(155,166,181,.55); }
.stdSpine span{ font-size:11.25px; color:${T.platinum}; }
.stdDate{
  margin:0; font-family:var(--font-cormorant),serif; font-weight:500;
  font-size:22px; line-height:1.18; color:${T.ink};
}
.stdDate span{ display:block; white-space:nowrap; }
.stdYear{
  margin:8px 0 0; font-family:var(--font-cormorant),serif; font-weight:500;
  font-style:italic; font-size:20px; line-height:1.2; color:rgba(37,53,46,.72);
  white-space:nowrap;
}
.stdCity{
  margin:16px 0 0; font-size:11px; font-weight:500; letter-spacing:.22em;
  text-transform:uppercase; color:rgba(37,53,46,.66); white-space:nowrap;
}
.stdFoot{
  margin:12px 0 0; font-size:10.5px; font-weight:500; letter-spacing:.16em;
  text-transform:uppercase; color:rgba(155,166,181,.9); white-space:nowrap;
}

.stdHint{
  position:relative; margin:44px 0 0; font-size:15.625px; letter-spacing:.4em;
  text-transform:uppercase; color:rgba(200,210,224,.6);
  transition:opacity .5s ease; animation:stdBreathe 2.8s ease-in-out infinite;
}
.stdReset{
  position:absolute; bottom:26px; background:none; border:0; cursor:pointer;
  font-family:inherit; font-size:10px; letter-spacing:.32em; text-transform:uppercase;
  color:rgba(200,210,224,.5); transition:opacity .6s ease .4s, color .2s;
}
.stdReset:hover{ color:rgba(200,210,224,.9); }
.stdReset:focus-visible{ outline:1px solid rgba(200,210,224,.7); outline-offset:6px; }

/* the two bottom controls share one row so they cannot overlap */
.stdActions{
  position:absolute; bottom:26px; left:0; right:0;
  display:flex; align-items:center; justify-content:center; gap:30px;
}
.stdActions .stdReset{ position:static; bottom:auto; }
.stdContinue{ color:rgba(200,210,224,.82); }

/* skip sits clear of the card and is available from the first frame */
.stdSkip{
  top:20px; right:20px; bottom:auto; z-index:12;
  opacity:1; pointer-events:auto; transition:color .2s;
}

.stdMotes{ position:absolute; inset:0; pointer-events:none; }
.stdMotes span{
  position:absolute; bottom:-10px; border-radius:50%; background:${T.platinumLite};
  opacity:0; animation-name:stdRise; animation-timing-function:linear; animation-iteration-count:infinite;
}
@keyframes stdRise{
  0%{ transform:translateY(0) translateX(0); opacity:0 }
  15%{ opacity:.55 }
  100%{ transform:translateY(-105vh) translateX(26px); opacity:0 }
}
@keyframes stdBreathe{ 0%,100%{ opacity:.4 } 50%{ opacity:.85 } }

/* The stage is a fixed ${W}px wide. Scale it down so the same letter
   composition fits phones, tablets, and short landscape screens. */
@media (max-width:540px){ .stdHint{ margin-top:20px } }
@media (max-width:410px){ .stdHint{ margin-top:8px } }
@media (max-height:700px){
  .stdScale{ transform:scale(min(1, calc((100vw - 24px) / ${W}px), calc((100svh - 160px) / 520px))); }
}

@media (prefers-reduced-motion:reduce){
  .stdHint{ animation:none }
  .stdMotes, .stdTrail, .stdOrbs{ display:none }
  .stdSilSweep, .stdSilBloom{ display:none }
  .stdSilBase{ animation:none; stroke-dasharray:none }
}
`;
