"use client";

import { useContext } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { CursorContext } from "./cursor-context";
import FloatingCardContent from "./FloatingCardContent";
import { EASE_SIGNATURE, SPRING_TRANSITION } from "@/lib/motion";
import type { FloatingObjectConfig } from "@/types/floating-object";

const MAX_TRANSLATE = 8;
const MAX_TILT = 3;

const TIER_STYLES: Record<
  FloatingObjectConfig["tier"],
  { border: string; surface: string; shadow: string; hoverShadow: string }
> = {
  1: {
    border: "border-zinc-200",
    surface: "bg-neutral-50",
    shadow:
      "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_20px_40px_-12px_rgba(0,0,0,0.16)]",
    hoverShadow: "0 2px 4px rgba(0,0,0,0.08), 0 24px 48px -12px rgba(0,0,0,0.2)",
  },
  2: {
    border: "border-zinc-200/80",
    surface: "bg-neutral-50/90",
    shadow:
      "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_14px_32px_-10px_rgba(0,0,0,0.12)]",
    hoverShadow:
      "0 1px 3px rgba(0,0,0,0.06), 0 18px 36px -10px rgba(0,0,0,0.15)",
  },
  3: {
    border: "border-zinc-200/60",
    surface: "bg-neutral-50/80",
    shadow:
      "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-8px_rgba(0,0,0,0.09)]",
    hoverShadow: "0 1px 2px rgba(0,0,0,0.05), 0 13px 28px -8px rgba(0,0,0,0.12)",
  },
  4: {
    border: "border-zinc-200/45",
    surface: "bg-neutral-50/65",
    shadow:
      "shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_18px_-8px_rgba(0,0,0,0.07)]",
    hoverShadow: "0 1px 2px rgba(0,0,0,0.04), 0 11px 22px -8px rgba(0,0,0,0.1)",
  },
  5: {
    border: "border-zinc-200/30",
    surface: "bg-neutral-50/50",
    shadow:
      "shadow-[0_1px_1px_rgba(0,0,0,0.02),0_6px_14px_-6px_rgba(0,0,0,0.05)]",
    hoverShadow: "0 1px 1px rgba(0,0,0,0.03), 0 9px 18px -6px rgba(0,0,0,0.08)",
  },
};

export default function FloatingCard({
  id,
  position,
  width,
  height,
  hideOnMobile,
  visibleFrom = "md",
  tier,
  animation,
}: FloatingObjectConfig) {
  const cursor = useContext(CursorContext);
  const prefersReducedMotion = useReducedMotion();
  const {
    depth,
    parallaxStrength,
    entranceDelay,
    hoverScale,
    floatAmplitude,
    floatDuration,
    floatDelay,
  } = animation;
  const tierStyle = TIER_STYLES[tier];

  const fallbackMouseX = useMotionValue(0);
  const fallbackMouseY = useMotionValue(0);
  const mouseX = cursor?.mouseX ?? fallbackMouseX;
  const mouseY = cursor?.mouseY ?? fallbackMouseY;

  const active = Boolean(cursor) && !prefersReducedMotion;
  const rawX = useTransform(
    mouseX,
    [-1, 1],
    [-MAX_TRANSLATE * parallaxStrength, MAX_TRANSLATE * parallaxStrength]
  );
  const rawY = useTransform(
    mouseY,
    [-1, 1],
    [-MAX_TRANSLATE * parallaxStrength, MAX_TRANSLATE * parallaxStrength]
  );
  const rawRotate = useTransform(
    mouseX,
    [-1, 1],
    [-MAX_TILT * parallaxStrength, MAX_TILT * parallaxStrength]
  );

  const springX = useSpring(rawX, SPRING_TRANSITION);
  const springY = useSpring(rawY, SPRING_TRANSITION);
  const springRotate = useSpring(rawRotate, SPRING_TRANSITION);

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${
        hideOnMobile
          ? visibleFrom === "lg"
            ? "hidden lg:block"
            : "hidden md:block"
          : "block"
      }`}
      style={{
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        width,
        height,
      }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.6, delay: entranceDelay, ease: EASE_SIGNATURE }
      }
    >
      <motion.div
        className="h-full w-full"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [0, -floatAmplitude, 0],
                x: [0, floatAmplitude * 0.4, 0],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: floatDuration,
                delay: floatDelay,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
        }
      >
        <motion.div
          className={`pointer-events-auto h-full w-full rounded-2xl border ${tierStyle.border} ${tierStyle.surface} ${tierStyle.shadow}`}
          style={
            active
              ? { x: springX, y: springY, rotate: springRotate }
              : undefined
          }
          whileHover={{
            scale: hoverScale,
            y: -4 * depth,
            boxShadow: tierStyle.hoverShadow,
          }}
          transition={SPRING_TRANSITION}
        >
          <FloatingCardContent id={id} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
