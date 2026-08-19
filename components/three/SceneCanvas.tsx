"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useDesktopMotion } from "./useDesktopMotion";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";

// Deliberately NOT a single page-wide canvas shared across sections (as
// brief/06 originally sketched) — each section that wants 3D mounts its own
// small Canvas as a normal in-flow/absolute child of that section. That
// keeps 3D completely out of the fixed/pin/Lenis coordination that caused
// the mobile bugs earlier in this project; a section's Canvas just scrolls
// (or gets pinned) along with the rest of that section's DOM automatically.
export function SceneCanvas({
  children,
  className = "",
  cameraPosition = [0, 0, 8],
  fov = 45,
}: {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}) {
  const enabled = useDesktopMotion();

  if (!enabled) return null;

  return (
    <CanvasErrorBoundary>
      <Canvas
        className={className}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: cameraPosition, fov }}
      >
        {children}
      </Canvas>
    </CanvasErrorBoundary>
  );
}
