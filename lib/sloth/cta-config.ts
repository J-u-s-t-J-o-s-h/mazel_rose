/**
 * Hero CTA sloth tuning.
 * One sloth waves, walks to the far end of the other button, waves, and repeats.
 */
export const ctaSlothConfig = {
  modelUrl: "/models/cta-sloths.glb?v=hop",
  cameraFov: 28,
  maxPixelRatio: 1.5,
  waveClip: "Big_Wave_Hello",
  walkClip: "Funky_Walk",
  hopClip: "Hop_with_Arms_Raised",
  wavePlaybackRate: 0.4,
  walkPlaybackRate: 0.28,
  hopPlaybackRate: 0.85,
  /** Skip the clip's rest-pose windup and its fall back into the T-pose. */
  hopActiveStart: 0.22,
  hopActiveEnd: 0.5,
  /** One full turn while he is in the air. */
  hopSpinDegrees: 360,
  crossFadeSeconds: 0.45,
  departHoldSeconds: 0.55,
  travelSeconds: 18,
  initialDelayMs: 900,
  cameraPadding: 1.12,
  waveFacingDegrees: -8,
  walkFacingDegrees: 78,
  placement: {
    width: "clamp(6rem, 10vw, 8rem)",
    height: "clamp(6.5rem, 10vw, 8rem)",
  },
  /** Large enough that his head and wave clear the stacked RSVP button. */
  mobilePlacement: {
    width: "10.5rem",
    height: "11.5rem",
  },
} as const;
