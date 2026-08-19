"use client";

import { Component, type ReactNode } from "react";

// Any WebGL/R3F failure (unsupported context, driver quirk, etc.) disables
// just the 3D layer instead of taking down the page — the CSS-only version
// of every section is a complete experience on its own, 3D is an enhancement.
export class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("3D scene failed, continuing without it:", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
