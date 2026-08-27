"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import DotFormationCanvas, { type DotFormationHandle } from "@/components/DotFormationCanvas";

type TransitionContextValue = {
  navigate: (href: string) => void;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransitionNavigate() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransitionNavigate must be used within PageTransitionOverlay");
  return ctx;
}

const HOLD_MS = 500;
const MOBILE_BREAKPOINT = 768;

/**
 * Global, mounted once in the root layout. Any TransitionLink calls
 * navigate(href) instead of a plain route push: dots assemble into the
 * "Yez." wordmark (see DotFormationCanvas), hold briefly, then disperse
 * while the (already-navigated) destination page is revealed underneath.
 * Falls back to an instant navigation under reduced motion.
 */
export default function PageTransitionOverlay({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const canvasHandleRef = useRef<DotFormationHandle>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const sequenceStartedRef = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (runningRef.current || href === pathname) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        router.push(href);
        return;
      }

      runningRef.current = true;
      pendingHrefRef.current = href;
      sequenceStartedRef.current = false;
      setVisible(true);
    },
    [pathname, router]
  );

  // Runs once the overlay + canvas have actually mounted (i.e. after the
  // `visible` state change has committed) — driving this from an effect
  // rather than "setVisible then await requestAnimationFrame" guarantees
  // canvasHandleRef.current is populated before we call .enter() on it.
  useEffect(() => {
    if (!visible || sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;

    (async () => {
      gsap.set(backdropRef.current, { autoAlpha: 1 });

      await canvasHandleRef.current?.enter();
      if (pendingHrefRef.current) router.push(pendingHrefRef.current);

      await new Promise((resolve) => setTimeout(resolve, HOLD_MS));

      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      const exitPromise = canvasHandleRef.current?.exit();
      const fadePromise = new Promise<void>((resolve) => {
        gsap.to(backdropRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          delay: mobile ? 0.3 : 0.5,
          ease: "power1.out",
          onComplete: resolve,
        });
      });
      await Promise.all([exitPromise, fadePromise]);

      setVisible(false);
      runningRef.current = false;
      pendingHrefRef.current = null;
    })();
  }, [visible, router]);

  const isTransitioning = visible;
  const value = useMemo(() => ({ navigate, isTransitioning }), [navigate, isTransitioning]);

  return (
    <TransitionContext.Provider value={value}>
      {children}

      {visible && (
        <div ref={backdropRef} className="fixed inset-0 z-[90] bg-bone opacity-0">
          <DotFormationCanvas ref={canvasHandleRef} className="h-full w-full" />
        </div>
      )}
    </TransitionContext.Provider>
  );
}
