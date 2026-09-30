import * as THREE from "three";
import { hangingSlothConfig as config } from "@/lib/sloth/config";

type ArmSample = {
  arm: THREE.Quaternion;
  fore: THREE.Quaternion;
  hand: THREE.Quaternion;
};

export type SlothPose = {
  sloth: THREE.Object3D;
  waveSide: "Left" | "Right";
  waveRest: ArmSample;
  waveOut: ArmSample;
  spine: THREE.Bone;
  spineRest: THREE.Quaternion;
  neck: THREE.Bone;
  neckRest: THREE.Quaternion;
  head: THREE.Bone;
  headRest: THREE.Quaternion;
  face: THREE.Object3D;
};

function named(root: THREE.Object3D, name: string) {
  const found = root.getObjectByName(name);
  if (!found) throw new Error(`Missing ${name}`);
  return found as THREE.Bone;
}

function setWorldQuaternion(target: THREE.Object3D, worldQ: THREE.Quaternion) {
  const parentWorld = target.parent?.getWorldQuaternion(new THREE.Quaternion()) ?? new THREE.Quaternion();
  target.quaternion.copy(parentWorld.invert().multiply(worldQ));
  target.updateMatrixWorld(true);
}

function rotateWorld(target: THREE.Object3D, axis: THREE.Vector3, radians: number) {
  if (Math.abs(radians) < 1e-4) return;
  const delta = new THREE.Quaternion().setFromAxisAngle(axis, radians);
  const worldQ = target.getWorldQuaternion(new THREE.Quaternion()).premultiply(delta);
  setWorldQuaternion(target, worldQ);
}

function sampleArm(root: THREE.Object3D, side: "Left" | "Right"): ArmSample {
  return {
    arm: named(root, `${side}Arm`).quaternion.clone(),
    fore: named(root, `${side}ForeArm`).quaternion.clone(),
    hand: named(root, `${side}Hand`).quaternion.clone(),
  };
}

function applyArm(root: THREE.Object3D, side: "Left" | "Right", from: ArmSample, to: ArmSample, amount: number) {
  named(root, `${side}Arm`).quaternion.copy(from.arm).slerp(to.arm, amount);
  named(root, `${side}ForeArm`).quaternion.copy(from.fore).slerp(to.fore, amount);
  named(root, `${side}Hand`).quaternion.copy(from.hand).slerp(to.hand, amount);
}

/**
 * Turns the authored hang upside down so both feet sit up where the branch is,
 * and remembers an authored arm pose for the wave. The clip is not played again.
 */
export function createSlothPose(sloth: THREE.Object3D, mixer: THREE.AnimationMixer): SlothPose {
  const waveSide: "Left" | "Right" = config.gripSide === "right" ? "Left" : "Right";
  mixer.setTime(0.2);
  sloth.updateMatrixWorld(true);
  const waveOut = sampleArm(sloth, waveSide);
  mixer.setTime(config.hangTimeSeconds);
  sloth.updateMatrixWorld(true);
  const waveRest = sampleArm(sloth, waveSide);

  rotateWorld(named(sloth, "Hips"), new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(config.invertDegrees));
  const legBend = THREE.MathUtils.degToRad(config.kneeBendDegrees);
  named(sloth, "LeftLeg").rotateX(legBend);
  named(sloth, "RightLeg").rotateX(legBend);
  sloth.updateMatrixWorld(true);

  const spine = named(sloth, "Spine02");
  const neck = named(sloth, "neck");
  const head = named(sloth, "Head");
  return {
    sloth,
    waveSide,
    waveRest,
    waveOut,
    spine,
    spineRest: spine.quaternion.clone(),
    neck,
    neckRest: neck.quaternion.clone(),
    head,
    headRest: head.quaternion.clone(),
    face: named(sloth, "headfront"),
  };
}

function smooth(value: number) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

/** Holds the feet still. The free arm waves, then rests. */
export function applyPoseFrame(pose: SlothPose, elapsed: number, camera: THREE.Camera | null, animate: boolean) {
  pose.spine.quaternion.copy(pose.spineRest);
  let wave = 0.34;
  if (animate) {
    const sway = Math.sin((elapsed / config.bodySwaySeconds) * Math.PI * 2);
    pose.spine.rotateX(sway * THREE.MathUtils.degToRad(config.bodySwayDegrees));
    const active = config.waveLiftSeconds + config.waveHelloSeconds + config.waveLowerSeconds;
    const cycle = active + config.wavePauseSeconds;
    const local = elapsed % cycle;
    if (local < active) {
      const u = local / active;
      const envelope = Math.min(smooth(u / 0.18), smooth((1 - u) / 0.22));
      const swayWave = Math.sin(u * Math.PI * 4) * 0.5 + 0.5;
      wave = 0.34 + envelope * swayWave * 0.58;
    }
  }
  applyArm(pose.sloth, pose.waveSide, pose.waveRest, pose.waveOut, wave);
  lookTowardCamera(pose, camera);
  pose.sloth.updateMatrixWorld(true);
}

function lookTowardCamera(pose: SlothPose, camera: THREE.Camera | null) {
  pose.neck.quaternion.copy(pose.neckRest);
  pose.head.quaternion.copy(pose.headRest);
  pose.sloth.updateMatrixWorld(true);
  if (!camera) return;
  const origin = pose.head.getWorldPosition(new THREE.Vector3());
  const from = pose.face.getWorldPosition(new THREE.Vector3()).sub(origin);
  const to = camera.getWorldPosition(new THREE.Vector3()).sub(origin);
  to.y *= 0.35;
  if (from.lengthSq() < 1e-6 || to.lengthSq() < 1e-6) return;
  from.normalize();
  to.normalize();
  const turn = new THREE.Quaternion().setFromUnitVectors(from, to);
  const angle = 2 * Math.acos(THREE.MathUtils.clamp(Math.abs(turn.w), 0, 1));
  if (angle < 0.02) return;
  const neckTurn = new THREE.Quaternion().slerpQuaternions(
    new THREE.Quaternion(),
    turn,
    Math.min(1, THREE.MathUtils.degToRad(config.neckLimitDegrees) / angle),
  );
  applyLimited(pose.neck, neckTurn);
  pose.sloth.updateMatrixWorld(true);
  const origin2 = pose.head.getWorldPosition(new THREE.Vector3());
  const from2 = pose.face.getWorldPosition(new THREE.Vector3()).sub(origin2).normalize();
  const to2 = camera.getWorldPosition(new THREE.Vector3()).sub(origin2);
  to2.y *= 0.35;
  if (to2.lengthSq() < 1e-6) return;
  to2.normalize();
  const turn2 = new THREE.Quaternion().setFromUnitVectors(from2, to2);
  const angle2 = 2 * Math.acos(THREE.MathUtils.clamp(Math.abs(turn2.w), 0, 1));
  if (angle2 < 0.02) return;
  const headTurn = new THREE.Quaternion().slerpQuaternions(
    new THREE.Quaternion(),
    turn2,
    Math.min(1, THREE.MathUtils.degToRad(config.headLimitDegrees) / angle2),
  );
  applyLimited(pose.head, headTurn);
}

function applyLimited(target: THREE.Object3D, turn: THREE.Quaternion) {
  const axis = new THREE.Vector3(turn.x, turn.y, turn.z);
  if (axis.lengthSq() < 1e-8) return;
  rotateWorld(target, axis.normalize(), 2 * Math.acos(THREE.MathUtils.clamp(turn.w, -1, 1)));
}

export type FreeArmWave = {
  arm: THREE.Bone;
  fore: THREE.Bone;
  wrist: THREE.Bone;
  rest: ArmSample;
  clearance: ArmSample;
  greeting: ArmSample;
  foreDelta: THREE.Quaternion;
  wristDelta: THREE.Quaternion;
};

const FREE_ARM_WAVE_AXIS = new THREE.Vector3(0, 0, 1);

/**
 * Local quaternion offsets for the sideways hang.
 * Clearance eases the paw forward. Greeting lifts it beside the head.
 * Sampled forearm and paw vertices stay at least 4cm from the head and torso
 * through the lift and both flicks. Recheck if the baked pose changes.
 */
const FREE_ARM_OFFSETS = {
  clearance: {
    arm: [-0.0953156639, 0.0835914251, -0.0673730226, 0.9896404770],
    fore: [0.1038652558, 0.0197619456, 0.0692867517, 0.9919782357],
  },
  greeting: {
    arm: [-0.1986887408, 0.1524484798, -0.1453435673, 0.9571611634],
    fore: [0.2080130519, 0.0302443589, 0.1364876253, 0.9680841787],
  },
} as const;

/** Reads the baked curl. Nothing from the jump clip is sampled. */
export function createFreeArmWave(sloth: THREE.Object3D): FreeArmWave {
  const arm = named(sloth, "RightArm");
  const fore = named(sloth, "RightForeArm");
  const wrist = named(sloth, "RightHand");
  const rest = sampleArm(sloth, "Right");
  const offset = (key: typeof FREE_ARM_OFFSETS.clearance | typeof FREE_ARM_OFFSETS.greeting): ArmSample => ({
    arm: rest.arm.clone().multiply(new THREE.Quaternion(...key.arm)).normalize(),
    fore: rest.fore.clone().multiply(new THREE.Quaternion(...key.fore)).normalize(),
    hand: rest.hand.clone(),
  });
  return {
    arm,
    fore,
    wrist,
    rest,
    clearance: offset(FREE_ARM_OFFSETS.clearance),
    greeting: offset(FREE_ARM_OFFSETS.greeting),
    foreDelta: new THREE.Quaternion(),
    wristDelta: new THREE.Quaternion(),
  };
}

function placeFreeArm(wave: FreeArmWave, from: ArmSample, to: ArmSample, amount: number) {
  wave.arm.quaternion.copy(from.arm).slerp(to.arm, amount);
  wave.fore.quaternion.copy(from.fore).slerp(to.fore, amount);
  wave.wrist.quaternion.copy(from.hand).slerp(to.hand, amount);
}

/**
 * Follows rest -> clearance -> greeting, then retraces that same path.
 * Only the right arm chain is written. Both feet and LeftHand stay fixed.
 * No physics engine or per-frame collision solver is required for this
 * fixed, checked animation. The caller still owns pause/reduced motion.
 */
export function applyFreeArmWave(wave: FreeArmWave, elapsed: number, animate: boolean) {
  const lift = config.waveLiftSeconds;
  const hello = config.waveHelloSeconds;
  const lower = config.waveLowerSeconds;
  let progress = 0;
  let sway = 0;
  if (animate) {
    const active = lift + hello + lower;
    const local = Math.max(0, elapsed) % (active + config.wavePauseSeconds);
    if (local < lift) progress = local / lift;
    else if (local < lift + hello) {
      progress = 1;
      const u = (local - lift) / hello;
      const envelope = smooth(u / 0.15) * smooth((1 - u) / 0.15);
      sway = Math.sin(u * Math.PI * 4) * envelope;
    } else if (local < active) {
      progress = 1 - (local - lift - hello) / lower;
    }
  }

  const clearancePoint = 0.45;
  if (progress < clearancePoint) {
    placeFreeArm(wave, wave.rest, wave.clearance, smooth(progress / clearancePoint));
  } else {
    placeFreeArm(wave, wave.clearance, wave.greeting, smooth((progress - clearancePoint) / (1 - clearancePoint)));
  }

  wave.foreDelta.setFromAxisAngle(FREE_ARM_WAVE_AXIS, THREE.MathUtils.degToRad(10 * sway));
  wave.wristDelta.setFromAxisAngle(FREE_ARM_WAVE_AXIS, THREE.MathUtils.degToRad(-12 * sway));
  wave.fore.quaternion.multiply(wave.foreDelta);
  wave.wrist.quaternion.multiply(wave.wristDelta);
  wave.arm.updateMatrixWorld(true);
}
