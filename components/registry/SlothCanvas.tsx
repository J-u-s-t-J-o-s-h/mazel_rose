"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { hangingSlothConfig as config } from "@/lib/sloth/config";
import { applyFreeArmWave, createFreeArmWave } from "@/lib/sloth/pose";

type SlothCanvasProps = {
  reducedMotion: boolean;
  paused: boolean;
  onReady: () => void;
  onError: () => void;
};

export function SlothCanvas({ reducedMotion, paused, onReady, onError }: SlothCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const reducedRef = useRef(reducedMotion);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    reducedRef.current = reducedMotion;
    kickRef.current();
  }, [reducedMotion]);

  useEffect(() => {
    if (!paused) kickRef.current();
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      });
    } catch {
      onError();
      return;
    }

    const gl = renderer.getContext();
    if (!gl) {
      renderer.dispose();
      onError();
      return;
    }

    let disposed = false;
    let frame = 0;
    let elapsed = 0;
    let lastTick = performance.now();
    const framed: { box: THREE.Box3 | null } = { box: null };
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(config.cameraFov, 1, 0.05, 20);
    const loader = new GLTFLoader();

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width < 2 || height < 2) return;
      const phone = width < 700;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));
      renderer.setSize(width, height, false);
      if (framed.box) {
        frameCamera(camera, framed.box, width / height);
        renderer.render(scene, camera);
      } else {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    scene.add(new THREE.HemisphereLight(0xfff7ee, 0xc9b59a, 2.2));
    const key = new THREE.DirectionalLight(0xfff4e6, 2.4);
    key.position.set(2.6, 4.2, 3.4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xf0ddc4, 0.9);
    fill.position.set(-3.2, 2.1, 1.6);
    scene.add(fill);

    const rig = new THREE.Group();
    scene.add(rig);

    const fail = () => {
      if (disposed) return;
      onError();
    };

    Promise.all([
      loader.loadAsync(config.treeUrl),
      loader.loadAsync(config.slothUrl),
    ])
      .then(([treeGltf, slothGltf]) => {
        if (disposed) return;
        const tree = treeGltf.scene;
        const sloth = slothGltf.scene;
        calmMaterials(tree);
        calmMaterials(sloth);

        const mesh = sloth.getObjectByProperty("isSkinnedMesh", true) as THREE.SkinnedMesh | undefined;
        if (!mesh) {
          fail();
          return;
        }
        mesh.frustumCulled = false;
        sloth.scale.setScalar(config.slothScale);
        sloth.updateMatrixWorld(true);

        rig.add(tree);
        rig.add(sloth);
        if (!seatOnBranch(sloth, mesh)) {
          fail();
          return;
        }

        rig.rotation.y = THREE.MathUtils.degToRad(config.presentationYawDegrees);
        rig.updateMatrixWorld(true);

        const shadow = new THREE.Mesh(
          new THREE.CircleGeometry(0.42, 40),
          new THREE.MeshBasicMaterial({
            color: 0x24171b,
            transparent: true,
            opacity: 0.07,
            depthWrite: false,
          }),
        );
        const bounds = posedBounds(rig, mesh);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(0, bounds.min.y + 0.012, 0);
        rig.add(shadow);

        const wave = createFreeArmWave(sloth);
        framed.box = posedBounds(rig, mesh);
        const wristPoint = new THREE.Vector3();
        const waveMarks = [
          config.waveLiftSeconds * 0.2,
          config.waveLiftSeconds * 0.55,
          config.waveLiftSeconds,
          config.waveLiftSeconds + config.waveHelloSeconds * 0.125,
          config.waveLiftSeconds + config.waveHelloSeconds * 0.375,
        ];
        for (const mark of waveMarks) {
          applyFreeArmWave(wave, mark, true);
          framed.box.expandByPoint(wave.wrist.getWorldPosition(wristPoint));
        }
        applyFreeArmWave(wave, 0, false);
        framed.box.expandByScalar(0.16);
        if (host.parentElement) {
          const fitted = framed.box.getSize(new THREE.Vector3());
          const ratio = THREE.MathUtils.clamp(fitted.x / Math.max(fitted.y, 0.001), 0.9, 1.45);
          host.parentElement.style.aspectRatio = `${ratio}`;
          void host.offsetHeight;
        }
        frameCamera(camera, framed.box, host.clientWidth / Math.max(host.clientHeight, 1));
        renderer.render(scene, camera);
        onReady();

        const loop = () => {
          frame = 0;
          if (disposed || pausedRef.current) return;
          frame = requestAnimationFrame(loop);
          const now = performance.now();
          const delta = Math.min((now - lastTick) / 1000, 0.05);
          lastTick = now;
          const waving = !reducedRef.current && !config.wavePaused;
          if (waving) elapsed += delta;
          applyFreeArmWave(wave, waving ? elapsed : 0, waving);
          renderer.render(scene, camera);
        };
        const kick = () => {
          if (disposed || frame !== 0) return;
          if (pausedRef.current) return;
          lastTick = performance.now();
          frame = requestAnimationFrame(loop);
        };
        kickRef.current = kick;
        kick();
      })
      .catch(() => fail());

    const onContextLost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        const materials = Array.isArray(material) ? material : material ? [material] : [];
        for (const entry of materials) {
          const textured = entry as THREE.MeshStandardMaterial;
          textured.map?.dispose();
          textured.roughnessMap?.dispose();
          textured.metalnessMap?.dispose();
          textured.emissiveMap?.dispose();
          entry.dispose();
        }
      });
      renderer.domElement.remove();
    };
  }, [onError, onReady]);

  return <div ref={hostRef} className="absolute inset-0" />;
}

function calmMaterials(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.material) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      const standard = material as THREE.MeshStandardMaterial;
      standard.metalness = 0;
      standard.roughness = 0.88;
      standard.roughnessMap = null;
      standard.metalnessMap = null;
      standard.emissive?.set(0, 0, 0);
      standard.emissiveMap = null;
      standard.emissiveIntensity = 0;
      if ("specularIntensity" in standard) {
        (standard as THREE.MeshPhysicalMaterial).specularIntensity = 0.1;
      }
      standard.envMapIntensity = 0.2;
      standard.needsUpdate = true;
    }
  });
}

function posedBounds(rig: THREE.Object3D, mesh: THREE.SkinnedMesh) {
  const box = new THREE.Box3();
  rig.traverse((object) => {
    const candidate = object as THREE.Mesh;
    if (candidate.isMesh && !(candidate as THREE.SkinnedMesh).isSkinnedMesh) box.expandByObject(candidate);
  });
  for (const joint of mesh.skeleton.bones) box.expandByPoint(joint.getWorldPosition(new THREE.Vector3()));
  return box;
}

function seatOnBranch(sloth: THREE.Object3D, mesh: THREE.SkinnedMesh) {
  const anchor = new THREE.Vector3(config.branchAnchor.x, config.branchAnchor.y, config.branchAnchor.z);
  const branch = new THREE.Vector3(config.branchAxis.x, config.branchAxis.y, config.branchAxis.z);
  branch.y = 0;
  if (branch.lengthSq() < 1e-8) branch.set(1, 0, 0);
  branch.normalize();

  sloth.updateMatrixWorld(true);
  let contacts = branchGrips(mesh);
  if (!contacts) return null;

  // Hand (near the head) points toward the branch tip. Foot (near the hips) points toward the trunk.
  const clawAxis = contacts.hand.clone().sub(contacts.foot);
  clawAxis.y = 0;
  if (clawAxis.lengthSq() < 1e-8) clawAxis.set(1, 0, 0);
  clawAxis.normalize();
  const yaw = Math.atan2(branch.x, branch.z) - Math.atan2(clawAxis.x, clawAxis.z);
  sloth.rotation.y += yaw;
  sloth.updateMatrixWorld(true);

  contacts = branchGrips(mesh);
  if (!contacts) return null;
  const mid = contacts.hand.clone().add(contacts.foot).multiplyScalar(0.5);
  sloth.position.add(anchor.clone().sub(mid));
  sloth.position.x += config.gripOffset.x;
  sloth.position.y += config.gripOffset.y;
  sloth.position.z += config.gripOffset.z;
  sloth.updateMatrixWorld(true);

  const outward = anchor.clone().setY(0).sub(new THREE.Vector3(config.trunk.x, 0, config.trunk.z));
  if (outward.lengthSq() < 1e-8) outward.set(1, 0, 0);
  outward.normalize();
  sloth.position.add(outward.multiplyScalar(config.trunkClearance));
  sloth.updateMatrixWorld(true);
  return branchGrips(mesh);
}

/** The left hand and left foot hook the branch. The right arm and right leg hang. */
function branchGrips(mesh: THREE.SkinnedMesh) {
  const pair = gripPair(mesh, "LeftHand", "LeftFoot");
  if (!pair) return null;
  return { hand: pair[0], foot: pair[1] };
}

function gripPair(mesh: THREE.SkinnedMesh, firstName: string, secondName: string) {
  mesh.skeleton.update();
  const bones = mesh.skeleton.bones;
  const leftBone = bones.findIndex((bone) => bone.name === firstName);
  const rightBone = bones.findIndex((bone) => bone.name === secondName);
  if (leftBone < 0 || rightBone < 0) return null;

  const position = mesh.geometry.attributes.position;
  const skinIndex = mesh.geometry.attributes.skinIndex;
  const skinWeight = mesh.geometry.attributes.skinWeight;
  const boneMatrices = mesh.skeleton.boneMatrices;
  if (!boneMatrices || !skinIndex || !skinWeight) return null;
  const left: THREE.Vector3[] = [];
  const right: THREE.Vector3[] = [];
  const vertex = new THREE.Vector3();
  const skin = new THREE.Matrix4();
  const temp = new THREE.Matrix4();

  for (let i = 0; i < position.count; i++) {
    let slot = -1;
    let best = 0.45;
    for (let influence = 0; influence < 4; influence++) {
      const joint = skinIndex.getComponent(i, influence);
      const weight = skinWeight.getComponent(i, influence);
      if (joint === leftBone && weight > best) {
        slot = 0;
        best = weight;
      } else if (joint === rightBone && weight > best) {
        slot = 1;
        best = weight;
      }
    }
    if (slot < 0) continue;

    vertex.fromBufferAttribute(position, i).applyMatrix4(mesh.bindMatrix);
    skin.elements.fill(0);
    for (let influence = 0; influence < 4; influence++) {
      const joint = skinIndex.getComponent(i, influence);
      const weight = skinWeight.getComponent(i, influence);
      if (weight === 0) continue;
      temp.fromArray(boneMatrices, joint * 16);
      for (let element = 0; element < 16; element++) {
        skin.elements[element] += temp.elements[element] * weight;
      }
    }
    vertex
      .applyMatrix4(skin)
      .applyMatrix4(mesh.bindMatrixInverse)
      .applyMatrix4(mesh.matrixWorld);
    (slot === 0 ? left : right).push(vertex.clone());
  }

  const leftContact = topCluster(left);
  const rightContact = topCluster(right);
  if (!leftContact || !rightContact) return null;
  return [leftContact, rightContact] as const;
}

function topCluster(points: THREE.Vector3[]) {
  if (points.length < 8) return null;
  const ranked = [...points].sort((a, b) => b.y - a.y);
  const count = Math.max(8, Math.floor(ranked.length * 0.1));
  const cluster = ranked.slice(0, count);
  return cluster
    .reduce((sum, point) => sum.add(point), new THREE.Vector3())
    .multiplyScalar(1 / cluster.length);
}

function frameCamera(camera: THREE.PerspectiveCamera, box: THREE.Box3, aspect: number) {
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const focus = center.clone();
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const fitHeight = size.y;
  const fitWidth = size.x;
  const distance =
    Math.max(
      fitHeight / (2 * Math.tan(fov / 2)),
      fitWidth / (2 * Math.tan(fov / 2) * Math.max(aspect, 0.45)),
    ) * 1.14;
  camera.aspect = Math.max(aspect, 0.4);
  camera.position.set(focus.x, focus.y - size.y * 0.03, focus.z - distance);
  camera.lookAt(focus);
  camera.updateProjectionMatrix();
}
