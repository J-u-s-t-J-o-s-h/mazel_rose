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
    const cycle = config.waveDurationSeconds + config.wavePauseSeconds;
    const local = elapsed % cycle;
    if (local < config.waveDurationSeconds) {
      const u = local / config.waveDurationSeconds;
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
  armRest: THREE.Euler;
  foreRest: THREE.Euler;
};

/** Reads the baked curl. Nothing from the jump clip is sampled. */
export function createFreeArmWave(sloth: THREE.Object3D): FreeArmWave {
  const arm = named(sloth, "RightArm");
  const fore = named(sloth, "RightForeArm");
  return {
    arm,
    fore,
    armRest: new THREE.Euler().setFromQuaternion(arm.quaternion, "XYZ"),
    foreRest: new THREE.Euler().setFromQuaternion(fore.quaternion, "XYZ"),
  };
}

/**
 * Lifts the free arm toward the visitor and sets it back down.
 * The supporting feet and hand are not written.
 */
export function applyFreeArmWave(wave: FreeArmWave, elapsed: number, animate: boolean) {
  let envelope = 0;
  let hello = 0;
  if (animate) {
    const cycle = config.waveDurationSeconds + config.wavePauseSeconds;
    const local = elapsed % cycle;
    if (local < config.waveDurationSeconds) {
      const u = local / config.waveDurationSeconds;
      envelope = Math.sin(u * Math.PI);
      hello = Math.sin(u * Math.PI * 2) * envelope;
    }
  }
  const arm = wave.armRest;
  const fore = wave.foreRest;
  wave.arm.quaternion.setFromEuler(
    new THREE.Euler(
      arm.x + THREE.MathUtils.degToRad(20 * envelope + 10 * hello),
      arm.y,
      arm.z + THREE.MathUtils.degToRad(-70 * envelope),
      "XYZ",
    ),
  );
  wave.fore.quaternion.setFromEuler(
    new THREE.Euler(
      fore.x + THREE.MathUtils.degToRad(-60 * envelope),
      fore.y,
      fore.z + THREE.MathUtils.degToRad(-40 * envelope),
      "XYZ",
    ),
  );
  wave.arm.updateMatrixWorld(true);
}
