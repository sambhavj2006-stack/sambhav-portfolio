import { createContext } from "react";
import type { MotionValue } from "motion/react";

/**
 * Sambhav OS — the single source of truth for "where is the input force right now."
 * One listener feeds every cursor-reactive primitive on the page (grid, glow, magnetic
 * pull, floating cards) instead of each mounting its own pointermove handler.
 */
export type PointerFieldValue = {
  /** raw viewport px */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** -1..1, normalized to viewport center — for wide-area parallax */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** decaying speed of the pointer, px/ms-ish, 0 at rest — drives momentum-aware effects */
  speed: MotionValue<number>;
  /** 1 while a real pointer is present over the window, 0 once it leaves/blurs */
  presence: MotionValue<number>;
  /** seconds since mount — the engine's shared clock, drives procedural drift instead of per-widget timers */
  elapsed: MotionValue<number>;
  /** 0..1 document scroll progress */
  scrollProgress: MotionValue<number>;
  prefersReducedMotion: boolean;
  isCoarsePointer: boolean;
};

export const PointerFieldContext = createContext<PointerFieldValue | null>(null);
