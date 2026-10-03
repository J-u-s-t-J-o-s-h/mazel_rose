"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ctaSlothConfig } from "@/lib/sloth/cta-config";

type CtaSlothCanvasProps = {
  paused: boolean;
  reducedMotion: boolean;
  onError: () => void;
};

type PlaybackControls = {
  sync: () => void;
};

type Point = {
  x: number;
  y: number;
};

export function CtaSlothCanvas({
  paused,
  reducedMotion,
  onError,
}: CtaSlothCanvasProps) {
  const slothHostRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  const pausedRef = useRef(paused);
  const reducedMotionRef = useRef(reducedMotion);
  const controlsRef = useRef<PlaybackControls>({ sync: () => {} });
  const requestHopRef = useRef<() => void>(() => {});

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    controlsRef.current.sync();
  }, [paused]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    controlsRef.current.sync();
  }, [reducedMotion]);

  useEffect(() => {
    const slothHost = slothHostRef.current;
    const slothTrack = slothHost?.parentElement;
    if (!slothHost || !slothTrack) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      onError();
      return;
    }

    let disposed = false;
    let frame = 0;
    let lastTick = performance.now();
    let mode: "delay" | "wave" | "walk" | "hop" = "delay";
    let delayLeft = ctaSlothConfig.initialDelayMs / 1000;
    let atEnd = false;
    let headingToEnd = true;
    let walkTime = 0;
    let hopFrom: "wave" | "walk" = "wave";
    let hopWalkTime = 0;
    let hopFacing = ctaSlothConfig.waveFacingDegrees;
    let facing: number = ctaSlothConfig.waveFacingDegrees;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      ctaSlothConfig.cameraFov,
      1,
      0.05,
      40,
    );
    const loader = new GLTFLoader();
    let framedBounds: THREE.Box3 | null = null;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.setAttribute("aria-hidden", "true");
    slothHost.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff8ed, 0x59494e, 2.8));
    const key = new THREE.DirectionalLight(0xffe9cf, 3.1);
    key.position.set(-2.5, 4, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbad9df, 1.25);
    rim.position.set(3, 2, -2);
    scene.add(rim);

    const resize = () => {
      const width = slothHost.clientWidth;
      const height = slothHost.clientHeight;
      if (width < 2 || height < 2) return;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, ctaSlothConfig.maxPixelRatio),
      );
      renderer.setSize(width, height, false);
      const aspect = width / height;
      if (framedBounds) {
        frameCamera(camera, framedBounds, aspect, ctaSlothConfig.cameraPadding);
      } else {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
      const shown = shownTravel();
      placeSloth(slothHost, slothTrack, shown.walking, atEnd, headingToEnd, shown.time);
      renderer.render(scene, camera);
    };
    const shownTravel = () => ({
      walking: mode === "walk" || (mode === "hop" && hopFrom === "walk"),
      time: mode === "hop" ? hopWalkTime : walkTime,
    });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(slothHost);
    resizeObserver.observe(slothTrack);
    resize();

    const fail = () => {
      if (!disposed) onError();
    };

    loader
      .loadAsync(ctaSlothConfig.modelUrl)
      .then((gltf) => {
        if (disposed) return;
        const root = gltf.scene;
        softenMaterials(root);
        scene.add(root);

        const waveClip = gltf.animations.find(
          (animation) => animation.name === ctaSlothConfig.waveClip,
        );
        const walkClip = gltf.animations.find(
          (animation) => animation.name === ctaSlothConfig.walkClip,
        );
        if (!waveClip || !walkClip) {
          fail();
          return;
        }
        const selectedWave = waveClip;

        const mixer = new THREE.AnimationMixer(root);
        const waveAction = mixer.clipAction(waveClip);
        const walkAction = mixer.clipAction(walkClip);
        const hopClip = gltf.animations.find(
          (animation) => animation.name === ctaSlothConfig.hopClip,
        );
        const hopAction = hopClip ? mixer.clipAction(hopClip) : null;
        waveAction.setLoop(THREE.LoopOnce, 1);
        waveAction.clampWhenFinished = true;
        walkAction.setLoop(THREE.LoopRepeat, Infinity);
        if (hopAction) {
          hopAction.setLoop(THREE.LoopOnce, 1);
          hopAction.clampWhenFinished = true;
          hopAction.stop();
        }
        mixer.update(0);
        root.updateMatrixWorld(true);

        const bounds = sampleAnimatedBounds(root, mixer, waveAction, waveClip);
        bounds.union(sampleAnimatedBounds(root, mixer, walkAction, walkClip));
        framedBounds = bounds;
        mixer.stopAllAction();
        walkAction.setLoop(THREE.LoopRepeat, Infinity);
        waveAction.reset().play();
        mixer.setTime(1.4);
        waveAction.paused = true;
        root.rotation.y = THREE.MathUtils.degToRad(facing);
        frameCamera(
          camera,
          bounds,
          slothHost.clientWidth / Math.max(slothHost.clientHeight, 1),
          ctaSlothConfig.cameraPadding,
        );
        placeSloth(slothHost, slothTrack, false, false, true, 0);
        renderer.render(scene, camera);

        const ensureFrame = () => {
          if (frame || pausedRef.current || reducedMotionRef.current) return;
          lastTick = performance.now();
          frame = requestAnimationFrame(tick);
        };
        const startWave = () => {
          mode = "wave";
          walkAction.fadeOut(ctaSlothConfig.crossFadeSeconds);
          hopAction?.fadeOut(ctaSlothConfig.crossFadeSeconds);
          waveAction
            .reset()
            .setEffectiveTimeScale(ctaSlothConfig.wavePlaybackRate)
            .setEffectiveWeight(1)
            .fadeIn(ctaSlothConfig.crossFadeSeconds)
            .play();
          ensureFrame();
        };
        const startWalk = () => {
          mode = "walk";
          walkTime = 0;
          headingToEnd = !atEnd;
          waveAction.fadeOut(ctaSlothConfig.crossFadeSeconds);
          hopAction?.fadeOut(ctaSlothConfig.crossFadeSeconds);
          walkAction
            .reset()
            .setEffectiveTimeScale(ctaSlothConfig.walkPlaybackRate)
            .setEffectiveWeight(1)
            .fadeIn(ctaSlothConfig.crossFadeSeconds)
            .play();
          ensureFrame();
        };
        const startHop = () => {
          if (!hopAction || !hopClip || mode === "hop" || reducedMotionRef.current) return;
          hopFrom = mode === "walk" ? "walk" : "wave";
          hopWalkTime = walkTime;
          hopFacing = facing;
          mode = "hop";
          waveAction.fadeOut(ctaSlothConfig.crossFadeSeconds);
          walkAction.fadeOut(ctaSlothConfig.crossFadeSeconds);
          hopAction
            .reset()
            .setEffectiveTimeScale(ctaSlothConfig.hopPlaybackRate)
            .setEffectiveWeight(1)
            .fadeIn(ctaSlothConfig.crossFadeSeconds)
            .play();
          hopAction.time = hopClip.duration * ctaSlothConfig.hopActiveStart;
          ensureFrame();
        };
        const restoreAfterHop = (action: THREE.AnimationAction) => {
          // fadeOut turns enabled off once the weight hits zero, and play()
          // does not turn it back on. Hold the hop on its raised pose so the
          // blend does not play the clip's fall back into the bind pose.
          if (hopAction) hopAction.paused = true;
          action.enabled = true;
          action.paused = false;
          action.play();
          if (hopAction) action.crossFadeFrom(hopAction, ctaSlothConfig.crossFadeSeconds);
        };
        const finishHop = () => {
          if (hopAction) hopAction.paused = true;
          if (hopFrom === "walk") {
            mode = "walk";
            restoreAfterHop(walkAction);
            return;
          }
          const waveFinished = waveAction.time >= selectedWave.duration - 1 / 30;
          if (waveAction.paused || waveFinished) {
            startWave();
            return;
          }
          mode = "wave";
          restoreAfterHop(waveAction);
        };
        requestHopRef.current = startHop;
        function tick() {
          frame = 0;
          if (!slothHost || !slothTrack) return;
          if (disposed || pausedRef.current || reducedMotionRef.current) return;
          const now = performance.now();
          const delta = Math.min((now - lastTick) / 1000, 0.05);
          lastTick = now;

          if (mode === "delay") {
            delayLeft -= delta;
            if (delayLeft <= 0) startWave();
          } else {
            mixer.update(delta);
          }

          const stops = measureStops(slothHost, slothTrack);
          const travelFromX = headingToEnd ? stops.start.x : stops.end.x;
          const travelToX = headingToEnd ? stops.end.x : stops.start.x;
          if (mode === "hop" && hopAction && hopClip) {
            const start = hopClip.duration * ctaSlothConfig.hopActiveStart;
            const end = hopClip.duration * ctaSlothConfig.hopActiveEnd;
            const progress = THREE.MathUtils.clamp(
              (hopAction.time - start) / Math.max(end - start, 0.001),
              0,
              1,
            );
            root.rotation.y = THREE.MathUtils.degToRad(
              hopFacing + ctaSlothConfig.hopSpinDegrees * progress,
            );
          } else {
            const targetFacing =
              mode === "walk"
                ? travelToX >= travelFromX
                  ? ctaSlothConfig.walkFacingDegrees
                  : -ctaSlothConfig.walkFacingDegrees
                : ctaSlothConfig.waveFacingDegrees;
            facing = THREE.MathUtils.damp(facing, targetFacing, 4, delta);
            root.rotation.y = THREE.MathUtils.degToRad(facing);
          }

          if (mode === "wave" && waveAction.time >= selectedWave.duration - 1 / 30) {
            startWalk();
          } else if (mode === "walk") {
            walkTime += delta;
            if (
              walkTime >=
              ctaSlothConfig.departHoldSeconds + ctaSlothConfig.travelSeconds
            ) {
              atEnd = headingToEnd;
              startWave();
            }
          } else if (
            mode === "hop" &&
            hopAction &&
            hopClip &&
            hopAction.time >= hopClip.duration * ctaSlothConfig.hopActiveEnd
          ) {
            finishHop();
          }
          const shown = shownTravel();
          placeSloth(
            slothHost,
            slothTrack,
            shown.walking,
            atEnd,
            headingToEnd,
            shown.time,
          );
          renderer.render(scene, camera);
          frame = requestAnimationFrame(tick);
        }

        controlsRef.current = {
          sync: () => {
            if (!slothHost || !slothTrack) return;
            if (pausedRef.current || reducedMotionRef.current) {
              cancelAnimationFrame(frame);
              frame = 0;
              const shown = shownTravel();
              placeSloth(
                slothHost,
                slothTrack,
                shown.walking,
                atEnd,
                headingToEnd,
                shown.time,
              );
              renderer.render(scene, camera);
              return;
            }
            ensureFrame();
          },
        };

        if (!reducedMotionRef.current && !pausedRef.current) ensureFrame();
      })
      .catch(fail);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    const canvas = renderer.domElement;

    return () => {
      disposed = true;
      controlsRef.current = { sync: () => {} };
      requestHopRef.current = () => {};
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      disposeScene(scene);
      renderer.dispose();
      canvas.remove();
    };
  }, [onError]);

  return (
    <div
      ref={slothHostRef}
      data-sloth-canvas="wave"
      className="cta-sloth-canvas pointer-events-none absolute drop-shadow-[0_8px_8px_rgba(36,23,27,0.28)]"
      style={
        narrow ? ctaSlothConfig.mobilePlacement : ctaSlothConfig.placement
      }
    >
      <button
        type="button"
        aria-label="Tap the sloth"
        className="pointer-events-auto absolute inset-0 cursor-pointer border-0 bg-transparent p-0 touch-manipulation"
        onClick={() => requestHopRef.current()}
      />
    </div>
  );
}

function measureStops(slothHost: HTMLElement, slothTrack: HTMLElement) {
  const startStop = slothTrack.querySelector<HTMLElement>('[data-sloth-stop="start"]');
  const endStop = slothTrack.querySelector<HTMLElement>('[data-sloth-stop="end"]');
  const slothTrackRect = slothTrack.getBoundingClientRect();
  const width = slothHost.clientWidth;
  const height = slothHost.clientHeight;
  const narrow = window.matchMedia("(max-width: 639px)").matches;
  if (narrow && startStop) {
    const rect = startStop.getBoundingClientRect();
    const minX = 4 - slothTrackRect.left;
    const maxX = window.innerWidth - width - 4 - slothTrackRect.left;
    const clampX = (value: number) =>
      Math.min(Math.max(value, minX), Math.max(minX, maxX));
    const scheduleTop = endStop
      ? endStop.getBoundingClientRect().top
      : rect.bottom + 16;
    const y = scheduleTop - slothTrackRect.top - height - 8;
    return {
      start: {
        x: clampX(rect.left - slothTrackRect.left - width * 0.12),
        y,
      },
      end: {
        x: clampX(rect.right - slothTrackRect.left - width * 0.88),
        y,
      },
    };
  }
  const pointFor = (stop: HTMLElement, end: boolean): Point => {
    const rect = stop.getBoundingClientRect();
    return {
      x: end
        ? rect.right - slothTrackRect.left - width * 0.22
        : rect.left - slothTrackRect.left - width * 0.78,
      y: rect.bottom - slothTrackRect.top - height + 6,
    };
  };
  return {
    start: startStop ? pointFor(startStop, false) : { x: 0, y: 0 },
    end: endStop ? pointFor(endStop, true) : { x: 0, y: 0 },
  };
}

function placeSloth(
  slothHost: HTMLElement,
  slothTrack: HTMLElement,
  walking: boolean,
  atEnd: boolean,
  headingToEnd: boolean,
  walkTime: number,
) {
  if (slothHost.clientWidth < 2) return;
  const { start, end } = measureStops(slothHost, slothTrack);
  const from = headingToEnd ? start : end;
  const to = headingToEnd ? end : start;
  const movingTime = Math.max(0, walkTime - ctaSlothConfig.departHoldSeconds);
  const progress = Math.min(1, movingTime / ctaSlothConfig.travelSeconds);
  const point = walking
    ? {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      }
    : atEnd
      ? end
      : start;
  slothHost.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
}

function sampleAnimatedBounds(
  root: THREE.Object3D,
  mixer: THREE.AnimationMixer,
  action: THREE.AnimationAction,
  clip: THREE.AnimationClip,
) {
  const bounds = new THREE.Box3();
  const sample = new THREE.Box3();
  const sampleCount = 18;
  mixer.stopAllAction();
  action.reset().setLoop(THREE.LoopOnce, 1).play();
  action.clampWhenFinished = true;
  for (let index = 0; index <= sampleCount; index += 1) {
    mixer.setTime((clip.duration * index) / sampleCount);
    root.updateMatrixWorld(true);
    sample.setFromObject(root, true);
    bounds.union(sample);
  }
  const size = bounds.getSize(new THREE.Vector3());
  return bounds.expandByScalar(Math.max(size.x, size.y) * 0.035);
}

function frameCamera(
  camera: THREE.PerspectiveCamera,
  box: THREE.Box3,
  aspect: number,
  padding: number,
) {
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance =
    Math.max(
      size.y / (2 * Math.tan(fov / 2)),
      size.x / (2 * Math.tan(fov / 2) * Math.max(aspect, 0.45)),
    ) * padding;
  camera.aspect = Math.max(aspect, 0.4);
  camera.near = Math.max(0.05, distance / 100);
  camera.far = distance * 8;
  camera.position.set(center.x, center.y + size.y * 0.02, center.z + distance);
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}

function softenMaterials(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.material) return;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    for (const material of materials) {
      const standard = material as THREE.MeshStandardMaterial;
      standard.metalness = 0;
      standard.roughness = 0.9;
      standard.envMapIntensity = 0.15;
      standard.needsUpdate = true;
    }
  });
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material;
    const materials = Array.isArray(material)
      ? material
      : material
        ? [material]
        : [];
    for (const entry of materials) {
      const textured = entry as THREE.MeshStandardMaterial;
      textured.map?.dispose();
      textured.normalMap?.dispose();
      textured.roughnessMap?.dispose();
      textured.metalnessMap?.dispose();
      entry.dispose();
    }
  });
}
