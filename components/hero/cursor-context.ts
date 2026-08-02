import { createContext } from "react";
import type { MotionValue } from "motion/react";

export type CursorContextValue = {
  /** normalized -1..1 relative to container center, for parallax */
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  /** raw px relative to container top-left, for the cursor glow */
  glowX: MotionValue<number>;
  glowY: MotionValue<number>;
};

export const CursorContext = createContext<CursorContextValue | null>(null);
