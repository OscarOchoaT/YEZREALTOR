"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

// Brand palette only — no blue/cyan, no bloom/glow post-processing. "Real
// technology" here means actual WebGL depth, perspective and lighting
// (a camera you can dolly through, particles that occlude each other,
// specular highlight that moves with the light), not a neon color shift.
const COLORS = ["#7A5239", "#602F10", "#A89B8A", "#3D2A20"]; // cognac, siena, stone, cocoaBark

const DESKTOP_PARTICLES = 650;
const MOBILE_PARTICLES = 320;
const FIELD_RADIUS = 8;
const CONNECTOR_MAX_DIST = 2.4;
const CONNECTOR_MAX_PER_POINT = 2;

export type HeroCanvasHandle = {
  /** 0-1, matching the Hero timeline's own scrub progress exactly — driven
   * from Hero.tsx's existing ScrollTrigger onUpdate, not a second trigger of
   * our own (a second pinned/scrubbed trigger on the same section previously
   * corrupted both sections' progress math — see Hero.tsx history). */
  setProgress: (t: number) => void;
};

function buildField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Roughly spherical distribution, denser toward the center — reads as a
    // volume of scattered data rather than a uniform cube of dots.
    const r = FIELD_RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6; // flatten vertically
    positions[i * 3 + 2] = r * Math.cos(phi);

    color.set(COLORS[Math.floor(Math.random() * COLORS.length)]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return { positions, colors };
}

/** Sparse nearest-neighbor connector lines — a constellation, not a mesh.
 * Built once from the static positions (each particle only drifts slightly
 * around its own point later, so the lines stay approximately true). */
function buildConnectors(positions: Float32Array, count: number) {
  const linePositions: number[] = [];

  for (let i = 0; i < count; i++) {
    const ix = positions[i * 3];
    const iy = positions[i * 3 + 1];
    const iz = positions[i * 3 + 2];

    const candidates: { j: number; d: number }[] = [];
    for (let j = i + 1; j < count; j++) {
      const dx = ix - positions[j * 3];
      const dy = iy - positions[j * 3 + 1];
      const dz = iz - positions[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < CONNECTOR_MAX_DIST * CONNECTOR_MAX_DIST) candidates.push({ j, d });
    }
    candidates.sort((a, b) => a.d - b.d);
    for (const { j } of candidates.slice(0, CONNECTOR_MAX_PER_POINT)) {
      linePositions.push(ix, iy, iz, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
    }
  }

  return new Float32Array(linePositions);
}

/**
 * Full-bleed WebGL backdrop for the Hero — a soft-focus volume of scattered
 * "data" particles with real perspective depth (things nearer the camera
 * genuinely occlude/parallax past things farther away), gently connected
 * like a sparse network, lit by one warm-toned point light so the field
 * isn't flat-shaded. Idle: slow orbit + cursor parallax (desktop only —
 * mobile has no hover to parallax against). Scroll: `setProgress` dollies
 * the camera slightly forward, so scrolling through Hero's existing
 * choreography also reads as moving deeper into the scene.
 *
 * Deliberately NOT React Three Fiber: the rest of the site's canvas work
 * (DotFormationCanvas, InteractiveDotGrid) is hand-rolled — a raw
 * WebGLRenderer + rAF loop matches that pattern instead of adding a second,
 * declarative rendering paradigm for one component.
 */
const HeroCanvas = forwardRef<HeroCanvasHandle, { className?: string; mobile?: boolean }>(function HeroCanvas(
  { className, mobile = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setProgress: (t: number) => {
      progressRef.current = t;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const particleCount = mobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const group = new THREE.Group();
    scene.add(group);

    const { positions, colors } = buildField(particleCount);

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pointMaterial = new THREE.PointsMaterial({
      size: mobile ? 0.09 : 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);
    group.add(points);

    const linePositions = buildConnectors(positions, particleCount);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#A89B8A"),
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    // One warm point light plus a low ambient floor — the light itself has
    // nothing to shade (Points/Lines are unlit primitives), but it's the
    // seam ready for the phase-node geometry an in-progress design pass may
    // add later; kept here now so that addition doesn't need a lighting
    // pass of its own.
    const ambient = new THREE.AmbientLight("#F4F0E8", 0.6);
    const point = new THREE.PointLight("#F4F0E8", 40, 40);
    point.position.set(4, 5, 8);
    scene.add(ambient, point);

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    if (isFinePointer) window.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      const r = container.getBoundingClientRect();
      camera.aspect = r.width / Math.max(1, r.height);
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let cameraX = 0;
    let cameraY = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      // This instance may be the desktop or mobile variant while the other
      // breakpoint's is the one actually showing (both mount regardless of
      // which the CSS breakpoint currently hides) — a hidden ancestor makes
      // this 0x0, so skip the real work (and the WebGL draw call) rather
      // than rendering an invisible scene every frame. Cheap enough to just
      // check live each frame, which also means resizing the window across
      // the breakpoint corrects itself with no extra listener.
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const dt = clock.getDelta();
      group.rotation.y += dt * 0.045;

      cameraX += (mouse.x * 1.1 - cameraX) * 0.04;
      cameraY += (-mouse.y * 0.7 - cameraY) * 0.04;
      camera.position.x = cameraX;
      camera.position.y = cameraY;
      // Scroll dolly: progress 0 -> 1 pulls the camera forward, "into" the
      // field, in step with the existing DOM choreography scrubbing above it.
      camera.position.z = 14 - progressRef.current * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      pointGeometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [mobile]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});

export default HeroCanvas;
