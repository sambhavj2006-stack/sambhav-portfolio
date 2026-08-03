"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useSurfaceField } from "./useSurfaceField";

const RING_SPRING = { stiffness: 260, damping: 24, mass: 0.3 };
const DOT_SPRING = { stiffness: 420, damping: 28, mass: 0.15 };

type CursorVariant = "default" | "click" | "pull" | "view";

const RING_SCALE: Record<CursorVariant, number> = {
  default: 1,
  click: 1.5,
  pull: 0.55,
  view: 2.6,
};

const DOT_SCALE: Record<CursorVariant, number> = {
  default: 1,
  click: 0,
  pull: 1,
  view: 0,
};

function resolveVariant(target: EventTarget | null): CursorVariant {
  if (!(target instanceof Element)) return "default";
  const withData = target.closest("[data-cursor]");
  if (withData) {
    const value = withData.getAttribute("data-cursor");
    if (value === "click" || value === "pull" || value === "view") return value;
  }
  if (target.closest("a, button")) return "click";
  return "default";
}

/**
 * Sambhav OS cursor: the pointer becomes a small instrument — a ring and dot that morph
 * depending on what they're over (a link, a magnetic target, a card) instead of the
 * static system arrow. Position reads off the shared PointerField (no new mousemove
 * listener); variant detection uses one low-frequency `pointerover` listener, which only
 * fires on element-boundary crossings, not continuously.
 */
export default function CursorInstrument() {
  const field = useSurfaceField();
  const fallback = useMotionValue(0);
  const ringScale = useMotionValue(1);
  const dotScale = useMotionValue(1);

  const active = Boolean(field) && !field!.prefersReducedMotion && !field!.isCoarsePointer;

  const springX = useSpring(field?.x ?? fallback, RING_SPRING);
  const springY = useSpring(field?.y ?? fallback, RING_SPRING);
  const springRingScale = useSpring(ringScale, RING_SPRING);
  const springDotScale = useSpring(dotScale, DOT_SPRING);

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("cursor-instrument-active");
    return () => {
      document.documentElement.classList.remove("cursor-instrument-active");
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const handleOver = (event: PointerEvent) => {
      const variant = resolveVariant(event.target);
      ringScale.set(RING_SCALE[variant]);
      dotScale.set(DOT_SCALE[variant]);
    };
    window.addEventListener("pointerover", handleOver, { passive: true });
    return () => window.removeEventListener("pointerover", handleOver);
  }, [active, ringScale, dotScale]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
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
