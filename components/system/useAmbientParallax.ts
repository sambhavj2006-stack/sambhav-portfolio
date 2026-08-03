"use client";

import { useMotionValue, useSpring, useTransform } from "motion/react";
import { SPRING_TRANSITION } from "@/lib/motion";
import { useSurfaceField } from "./useSurfaceField";

/**
 * Sambhav OS shared environment: the same normalized cursor position that drives the
 * floating widgets and the grid also gives content a faint sense of depth. Returns a
 * spring-smoothed { x, y } in px, pinned to zero outside the provider, on reduced
 * motion, or on coarse pointers.
 */
export function useAmbientParallax(strength = 1, max = 8) {
  const field = useSurfaceField();
  const zero = useMotionValue(0);
  const rawX = useTransform(field?.nx ?? zero, (v) => v * max * strength);
  const rawY = useTransform(field?.ny ?? zero, (v) => v * max * strength);
  const springX = useSpring(rawX, SPRING_TRANSITION);
  const springY = useSpring(rawY, SPRING_TRANSITION);
  const active = Boolean(field) && !field!.prefersReducedMotion && !field!.isCoarsePointer;

  return { x: active ? springX : zero, y: active ? springY : zero };
}
