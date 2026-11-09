"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { INERTIA_SPRING } from "@/lib/motion";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";

/**
 * Sambhav OS scroll behaviour: reading progress grows like a current running through a
 * wire — a damped, overdamped spring so it never overshoots, with a bright leading tip
 * that carries the charge.
 */
/** `visible` is false while the header is still transparent over the Hero, so the
 *  track never draws a hairline straight across the portrait. */
export default function NavProgress({ visible }: { visible: boolean }) {
  const prefersReducedMotion = useSettledReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, INERTIA_SPRING);
  const tipLeft = useTransform(progress, (v) => `${v * 100}%`);
  // Hidden at the very top so the tip doesn't sit as a stray dot on the left edge.
  const tipOpacity = useTransform(progress, [0, 0.01], [0, 1]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 h-px bg-zinc-200/70 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <motion.div
        className="absolute inset-y-0 left-0 origin-left bg-zinc-900"
        style={{ scaleX: prefersReducedMotion ? scrollYProgress : progress }}
      />
      {!prefersReducedMotion && (
        <motion.div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-zinc-900 shadow-[0_0_6px_2px_rgba(0,0,0,0.35)]"
          style={{ left: tipLeft, x: "-50%", opacity: tipOpacity }}
        />
      )}
    </div>
  );
}
