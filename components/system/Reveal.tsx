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
  className?: string;
  as?: RevealTag;
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
  className,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useSettledReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.6, delay, ease: EASE_SIGNATURE }}
    >
      {children}
    </MotionTag>
  );
}
