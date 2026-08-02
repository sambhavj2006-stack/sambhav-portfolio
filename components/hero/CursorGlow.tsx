"use client";

import { useContext } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { CursorContext } from "./cursor-context";

const GLOW_SIZE = 640;
const SPRING = { stiffness: 80, damping: 24, mass: 0.6 };

export default function CursorGlow() {
  const cursor = useContext(CursorContext);
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const springX = useSpring(cursor?.glowX ?? fallbackX, SPRING);
  const springY = useSpring(cursor?.glowY ?? fallbackY, SPRING);

  if (!cursor) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 rounded-full"
      style={{
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, rgba(0,0,0,0.035), transparent 70%)",
      }}
    />
  );
}
