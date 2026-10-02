/**
 * Hero CTA sloth tuning.
 * One sloth waves, walks to the far end of the other button, waves, and repeats.
 */
export const ctaSlothConfig = {
  modelUrl: "/models/cta-sloths.glb",
  cameraFov: 28,
  maxPixelRatio: 1.5,
  waveClip: "Big_Wave_Hello",
  walkClip: "Funky_Walk",
  wavePlaybackRate: 0.85,
  walkPlaybackRate: 0.28,
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
} as const;
