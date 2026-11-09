"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useSettledReducedMotion } from "./useSettledReducedMotion";

/**
 * Heavy, weighted scrolling — the page moves like sand settling, not like a document.
 * Lenis keeps native scroll underneath, so motion's useScroll, anchors and the world's
 * scroll-driven mood all keep working. Off entirely under reduced motion.
 */
export default function SmoothScroll() {
  const reduced = useSettledReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      anchors: { offset: -72 },
    });
    return () => lenis.destroy();
  }, [reduced]);

  return null;
}
