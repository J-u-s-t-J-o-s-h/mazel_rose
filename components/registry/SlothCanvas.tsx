"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { hangingSlothConfig as config } from "@/lib/sloth/config";

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
    let lastTick = performance.now();
    const framed: { box: THREE.Box3 | null } = { box: null };
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(config.cameraFov, 1, 0.05, 40);
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

    loader
      .loadAsync(config.sceneUrl)
      .then((gltf) => {
        if (disposed) return;
        const root = gltf.scene;
        calmMaterials(root);
        root.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.isMesh) mesh.frustumCulled = false;
        });
        rig.add(root);

        const mixer = new THREE.AnimationMixer(root);
        const clip =
          gltf.animations.find((entry) => entry.name === "Lively_Loop") ?? gltf.animations[0];
        if (clip) mixer.clipAction(clip).play();
        mixer.setTime(0);
        root.updateMatrixWorld(true);

        const bounds = posedBounds(root);
        const shadow = new THREE.Mesh(
          new THREE.CircleGeometry(Math.max(bounds.getSize(new THREE.Vector3()).x * 0.18, 0.42), 40),
          new THREE.MeshBasicMaterial({
            color: 0x24171b,
            transparent: true,
            opacity: 0.07,
            depthWrite: false,
          }),
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(0, bounds.min.y + 0.012, 0);
        rig.add(shadow);

        framed.box = bounds.clone().expandByScalar(0.2);
        if (host.parentElement) {
          const fitted = framed.box.getSize(new THREE.Vector3());
          const ratio = THREE.MathUtils.clamp(fitted.x / Math.max(fitted.y, 0.001), 0.9, 1.55);
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
          if (!reducedRef.current) mixer.update(delta);
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
    const canvasEl = renderer.domElement;

    return () => {
      disposed = true;
      kickRef.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvasEl.removeEventListener("webglcontextlost", onContextLost);
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        const materials = Array.isArray(material) ? material : material ? [material] : [];
        for (const entry of materials) {
          const textured = entry as THREE.MeshStandardMaterial;
          textured.map?.dispose();
          textured.normalMap?.dispose();
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

function posedBounds(root: THREE.Object3D) {
  const box = new THREE.Box3();
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && !(mesh as THREE.SkinnedMesh).isSkinnedMesh) box.expandByObject(mesh);
    const skinned = object as THREE.SkinnedMesh;
    if (skinned.isSkinnedMesh && skinned.skeleton) {
      for (const joint of skinned.skeleton.bones) {
        box.expandByPoint(joint.getWorldPosition(new THREE.Vector3()));
      }
    }
  });
  return box;
}

function frameCamera(camera: THREE.PerspectiveCamera, box: THREE.Box3, aspect: number) {
  const size = box.getSize(new THREE.Vector3());
  const focus = box.getCenter(new THREE.Vector3());
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance =
    Math.max(
      size.y / (2 * Math.tan(fov / 2)),
      size.x / (2 * Math.tan(fov / 2) * Math.max(aspect, 0.45)),
    ) * 1.12;
  camera.aspect = Math.max(aspect, 0.4);
  camera.near = Math.max(0.05, distance / 100);
  camera.far = distance * 8;
  camera.position.set(focus.x, focus.y + size.y * 0.06, focus.z + distance);
  camera.lookAt(focus);
  camera.updateProjectionMatrix();
}
