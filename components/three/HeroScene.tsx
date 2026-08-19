"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

// Mid-century geometric field (brief/06 §Sección 1 — Hero): a handful of
// simple forms drifting slowly, reacting gently to the pointer. Stands in for
// "possibilities/questions" ahead of #differentiation's answer.
type ShapeKind = "sphere" | "box" | "torus";

const SHAPES: Array<{
  position: [number, number, number];
  scale: number;
  color: string;
  kind: ShapeKind;
}> = [
  { position: [-2.6, 1.1, -2], scale: 1.05, color: "#7A5239", kind: "sphere" },
  { position: [2.8, -0.6, -3], scale: 1.5, color: "#602F10", kind: "torus" },
  { position: [1.6, 1.9, -1.5], scale: 0.65, color: "#A89B8A", kind: "box" },
  { position: [-2.1, -1.7, -2.5], scale: 0.85, color: "#3D2A20", kind: "sphere" },
  { position: [3.1, 1.7, -4], scale: 1.05, color: "#7A5239", kind: "box" },
];

function Shape({
  position,
  scale,
  color,
  kind,
  index,
}: (typeof SHAPES)[number] & { index: number }) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    const node = ref.current;
    if (!node) return;
    const t = state.clock.elapsedTime;
    node.rotation.x = t * 0.08 + index;
    node.rotation.y = t * 0.1 + index * 0.6;
    node.position.y = position[1] + Math.sin(t * 0.35 + index) * 0.25;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        {kind === "sphere" && <sphereGeometry args={[0.6, 32, 32]} />}
        {kind === "torus" && <torusGeometry args={[0.5, 0.18, 16, 48]} />}
        {kind === "box" && <boxGeometry args={[0.9, 0.9, 0.9]} />}
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
      </mesh>
    </group>
  );
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    const node = ref.current;
    if (!node) return;
    const targetX = state.pointer.y * 0.12;
    const targetY = state.pointer.x * 0.18;
    node.rotation.x += (targetX - node.rotation.x) * 0.04;
    node.rotation.y += (targetY - node.rotation.y) * 0.04;
  });

  return <group ref={ref}>{children}</group>;
}

export function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <ParallaxRig>
        {SHAPES.map((shape, i) => (
          <Shape key={i} index={i} {...shape} />
        ))}
      </ParallaxRig>
    </>
  );
}
