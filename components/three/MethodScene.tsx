"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Mesh, type MeshStandardMaterial } from "three";

// One form, 4 states — brief/06 §Sección 5 (The Next Move Method™). Driven by
// the *existing* "method-pin" ScrollTrigger's progress (written into
// progressRef by Method.tsx's onUpdate) rather than creating a second
// competing ScrollTrigger on the same section.
//
// Decode (chaotic: fast rotation, jitter, low opacity, wireframe visible) →
// Advance (resolved: slow rotation, still, full opacity, wireframe gone).
// Color travels Siena → Cognac → Stone → Cocoa Bark across the four stages.
const STAGE_COLORS = ["#602F10", "#7A5239", "#A89B8A", "#3D2A20"].map(
  (hex) => new Color(hex)
);

export function MethodScene({ progressRef }: { progressRef: RefObject<number> }) {
  const solidRef = useRef<Mesh>(null);
  const wireRef = useRef<Mesh>(null);
  const solidMatRef = useRef<MeshStandardMaterial>(null);
  const wireMatRef = useRef<MeshStandardMaterial>(null);
  const colorRef = useRef(new Color(STAGE_COLORS[0]));

  useFrame((state) => {
    const p = Math.min(1, Math.max(0, progressRef.current ?? 0));
    const stagePos = p * (STAGE_COLORS.length - 1);
    const stage = Math.min(STAGE_COLORS.length - 2, Math.floor(stagePos));
    const localT = stagePos - stage;
    const chaos = 1 - p;
    const t = state.clock.elapsedTime;

    const solid = solidRef.current;
    if (solid) {
      const speed = 0.15 + chaos * 0.9;
      solid.rotation.y = t * speed;
      solid.rotation.x = t * speed * 0.6;
      solid.position.x = Math.sin(t * 3 + 1) * 0.08 * chaos;
      solid.position.y = Math.cos(t * 2.4) * 0.08 * chaos;
      solid.scale.setScalar(1.1 + p * 0.25);
    }

    const wire = wireRef.current;
    if (wire && solid) {
      wire.rotation.copy(solid.rotation);
      wire.position.copy(solid.position);
      wire.scale.setScalar(solid.scale.x * 1.04);
    }

    colorRef.current.copy(STAGE_COLORS[stage]).lerp(STAGE_COLORS[stage + 1], localT);

    if (solidMatRef.current) {
      solidMatRef.current.color.copy(colorRef.current);
      solidMatRef.current.opacity = 0.35 + p * 0.65;
    }
    if (wireMatRef.current) {
      wireMatRef.current.opacity = 0.5 * chaos;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <mesh ref={solidRef}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshStandardMaterial
          ref={solidMatRef}
          roughness={0.4}
          metalness={0.15}
          transparent
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial ref={wireMatRef} color="#F4F0E8" wireframe transparent />
      </mesh>
    </>
  );
}
