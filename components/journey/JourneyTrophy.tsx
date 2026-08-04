"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useTransform, type MotionValue } from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";

type JourneyTrophyProps = {
  progress: MotionValue<number>;
  activeIndex: number;
  prefersReducedMotion: boolean;
};

/**
 * A small badge that travels down the Journey rail 1:1 with scroll progress (same motion
 * value that drives the rail's fill), and gives a brief scale pulse whenever the nearest
 * milestone changes — the "reached a milestone" beat. Position is a pure function of
 * scroll, so it still tracks correctly under reduced motion; only the pulse is skipped.
 */
export default function JourneyTrophy({
  progress,
  activeIndex,
  prefersReducedMotion,
}: JourneyTrophyProps) {
  const top = useTransform(progress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);
  const controls = useAnimationControls();
  const mounted = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (activeIndex < 0) return;
    controls.start({
      scale: [1, 1.22, 1],
      transition: { duration: 0.5, ease: EASE_SIGNATURE },
    });
  }, [activeIndex, controls, prefersReducedMotion]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ top }}
    >
      <motion.div
        animate={controls}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 shadow-[0_2px_6px_rgba(0,0,0,0.25)] ring-4 ring-white"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="white"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 4h10v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z" />
          <path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5 3.5 3.5 0 0 0 6.5 10H7" />
          <path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5 3.5 3.5 0 0 1 17.5 10H17" />
          <path d="M12 12v3" />
          <path d="M9 19h6" />
          <path d="M10 15h4l.6 4H9.4l.6-4Z" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
