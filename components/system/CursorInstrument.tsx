"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useMotionValueEvent, useSpring } from "motion/react";
import {
  CURSOR_DOT_SCALE,
  CURSOR_DOT_SPRING,
  CURSOR_RING_SCALE,
  CURSOR_RING_SPRING,
} from "@/lib/motionSystem";
import { useSurfaceField } from "./useSurfaceField";

/**
 * Sambhav OS cursor: the pointer becomes a small instrument — a ring and dot that morph
 * depending on what they're over (a link, a magnetic target, a card, navigation, the
 * timeline) instead of the static system arrow. Position and variant both read off the
 * shared PointerField (no listener of its own): `cursorTarget` is written by the single
 * `pointerover` listener in PointerFieldProvider, which every cursor-reactive surface
 * shares.
 */
export default function CursorInstrument() {
  const field = useSurfaceField();
  const fallback = useMotionValue(0);
  const fallbackVariant = useMotionValue<keyof typeof CURSOR_RING_SCALE>("default");
  const ringScale = useMotionValue(1);
  const dotScale = useMotionValue(1);

  const active = Boolean(field) && !field!.prefersReducedMotion && !field!.isCoarsePointer;

  const springX = useSpring(field?.x ?? fallback, CURSOR_RING_SPRING);
  const springY = useSpring(field?.y ?? fallback, CURSOR_RING_SPRING);
  const springRingScale = useSpring(ringScale, CURSOR_RING_SPRING);
  const springDotScale = useSpring(dotScale, CURSOR_DOT_SPRING);

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("cursor-instrument-active");
    return () => {
      document.documentElement.classList.remove("cursor-instrument-active");
    };
  }, [active]);

  useMotionValueEvent(field?.cursorTarget ?? fallbackVariant, "change", (variant) => {
    ringScale.set(CURSOR_RING_SCALE[variant]);
    dotScale.set(CURSOR_DOT_SCALE[variant]);
  });

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-100">
      <motion.div
        className="absolute left-0 top-0 h-6 w-6 rounded-full border border-white mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          scale: springRingScale,
        }}
      />
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          scale: springDotScale,
        }}
      />
    </div>
  );
}
