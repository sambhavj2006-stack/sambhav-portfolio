"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { INERTIA_SPRING } from "@/lib/motion";
import { useSettledReducedMotion } from "./useSettledReducedMotion";

type ScrollStageProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

/**
 * Sambhav OS cinematic scroll: wraps a top-level section so it gains clarity as it
 * enters the viewport and eases back slightly on its way out — the visual "handoff"
 * between sections that makes scrolling read as one continuous surface instead of
 * independent blocks stacked on a page. Subtle by design: opacity/scale never travel
 * far, and only opacity+scale move (both composited, no layout thrash). The progress
 * curve is smoothed through a spring so the handoff settles rather than snapping
 * frame-to-frame with raw scroll position — that's what reads as a "flash" at speed.
 *
 * A client boundary around otherwise-server content: children keep rendering on the
 * server, only this thin wrapper needs the browser's scroll position.
 */
export default function ScrollStage({ children, className, id }: ScrollStageProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useSettledReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, INERTIA_SPRING);
  const progress = prefersReducedMotion ? scrollYProgress : smoothProgress;
  const opacity = useTransform(progress, [0, 0.28, 0.78, 1], [0.82, 1, 1, 0.92]);
  const scale = useTransform(progress, [0, 0.28, 0.78, 1], [0.992, 1, 1, 0.996]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={prefersReducedMotion ? undefined : { opacity, scale }}
    >
      {children}
    </motion.section>
  );
}
