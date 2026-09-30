/**
 * Hanging sloth scene.
 * Distances use the models' shared unit, about one meter.
 * Change branchAnchor, branchAxis, slothScale, and the yaw values to reseat the grip.
 */
export const hangingSlothConfig = {
  treeUrl: "/models/tree.glb",
  slothUrl: "/models/sloth-curl.glb",

  /** Kept for the old hang clip. The curl file has no animation, so this is unused. */
  hangTimeSeconds: 1.733,

  /** Turns the hanging skeleton so both feet point up toward the branch. */
  invertDegrees: 180,

  /** Local knee flexion added after the invert. Zero keeps the authored leg shape. */
  kneeBendDegrees: 0,

  /** The right arm waves. The left hand and left foot stay on the branch. */
  gripSide: "left" as "left" | "right",

  /** Uniform scale applied to the sloth before the claws are seated. */
  slothScale: 0.7,

  /**
   * Point on the exposed right-hand limb where the claws should meet.
   * Measured from the tree model before presentation yaw.
   */
  branchAnchor: { x: 0.26, y: 0.14, z: -0.14 },

  /** Direction of that limb. The swing axis is the line through the claws after seating. */
  branchAxis: { x: 0.97, y: 0, z: -0.24 },

  /** Trunk center, used to keep the body on the outer side of the limb. */
  trunk: { x: -0.14, z: 0.06 },

  /** Midpoint of the two grips. The hand lands on the outer limb and the foot toward the trunk. */
  gripOffset: { x: 0, y: 0, z: 0 },

  /**
   * Holds the free arm on the baked pose while that pose is being adjusted.
   * The wave timing below stays in place for when this is turned off.
   */
  wavePaused: true,

  /** Lift the free hand out beside the face. The jump clip is not used. */
  waveLiftSeconds: 0.9,

  /** Two sideways wrist waves while the arm stays raised. */
  waveHelloSeconds: 1.7,

  /** Return the free arm to its rest. */
  waveLowerSeconds: 0.85,

  /** Stillness after the arm is lowered. */
  wavePauseSeconds: 1.6,

  /** Shoulder lift during the wave, in degrees. */
  waveLiftDegrees: 28,

  /** Side-to-side reach of the wave, relative to the resting arm. */
  waveSway: 0.55,

  /** Gentle spine motion that does not move the planted feet. */
  bodySwayDegrees: 1.6,
  bodySwaySeconds: 5.5,

  /** Neck and head turns toward the camera, kept small so the neck does not kink. */
  neckLimitDegrees: 22,
  headLimitDegrees: 26,

  /** Push the seated sloth outward, away from the trunk. Keep this small so the claws stay on the limb. */
  trunkClearance: 0,

  /** Turns the planted tree so the limb and the sloth face the camera. */
  presentationYawDegrees: 0,

  cameraFov: 32,
  cameraPadding: 1.28,
} as const;
