"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_SIGNATURE, REVEAL_VIEWPORT } from "@/lib/motion";
import { useSettledReducedMotion } from "./useSettledReducedMotion";

type RevealTag = "div" | "ul" | "section";

type RevealProps = {
  children: ReactNode;
  /** seconds, entrance stagger delay */
  delay?: number;
  /** px, how far the content rises into place */
  distance?: number;
  /** cinematic entrance for major headlines — content resolves into focus as it rises */
  blur?: boolean;
  className?: string;
  as?: RevealTag;
  /** forwarded to the rendered element as `data-cursor`, for the shared cursor-variant system */
  "data-cursor"?: string;
};

/**
 * Sambhav OS reveal behaviour: content rises and settles into place once, the moment a
 * section wakes up in the viewport. Every scroll-triggered entrance on the site should
 * use this instead of hand-rolling the same whileInView block.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 16,
  blur = false,
  className,
  as = "div",
  "data-cursor": dataCursor,
}: RevealProps) {
  const prefersReducedMotion = useSettledReducedMotion();
  const MotionTag = motion[as];

  const initial = prefersReducedMotion
    ? false
    : blur
      ? { opacity: 0, y: distance, filter: "blur(6px)" }
      : { opacity: 0, y: distance };

  return (
    <MotionTag
      className={className}
      data-cursor={dataCursor}
      initial={initial}
      whileInView={blur ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: blur ? 0.8 : 0.6, delay, ease: EASE_SIGNATURE }}
    >
      {children}
    </MotionTag>
  );
}
