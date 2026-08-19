// Central GSAP registration — brief/06-3d-scrollytelling-tech-plan.md §1.
// Import gsap/ScrollTrigger/SplitText/useGSAP from here (not "gsap" directly)
// so every plugin used in the project is registered exactly once.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

  // Mobile browsers fire a `resize` event when the address bar hides/shows
  // as you scroll. By default ScrollTrigger refreshes on every resize, which
  // recalculates pinned sections' end position *mid-scroll* — for #method
  // that moved the pin's end further down the page while the user was
  // already scrolling through it, so the timeline (tied to scroll fraction)
  // never reached progress 1 by the time the user physically scrolled past
  // the section ("04/Advance" always felt late). ignoreMobileResize tells
  // ScrollTrigger to tolerate address-bar-sized height changes (< 25% of the
  // viewport) on touch devices without refreshing, while still refreshing on
  // real resizes/orientation changes.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
