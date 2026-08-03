"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { journeyMilestones } from "@/data/journey-milestones";
import { INERTIA_SPRING } from "@/lib/motion";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import JourneyMilestone from "./JourneyMilestone";

/**
 * Sambhav OS scroll behaviour: the timeline draws itself in as you scroll through it — a
 * thin rail that fills top to bottom, tied 1:1 to scroll position (not autoplaying, so
 * it stays fine under reduced motion — only the smoothing spring is skipped).
 */
export default function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useSettledReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const smoothProgress = useSpring(scrollYProgress, INERTIA_SPRING);
  const progress = prefersReducedMotion ? scrollYProgress : smoothProgress;

  return (
    <div
      ref={containerRef}
      className="relative border-b border-zinc-200 lg:pl-8 xl:pl-12"
    >
      {/* Aligned to the section's own left margin (same as the heading above it), so the
          rail reads as an extension of the content's edge — an architectural guide the
          milestones sit a deliberate distance to the right of, never touching it. */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 hidden w-px origin-top bg-zinc-900 lg:block"
        style={{ height: "100%", scaleY: progress }}
      />
      {journeyMilestones.map((milestone, index) => (
        <JourneyMilestone key={milestone.id} {...milestone} index={index} />
      ))}
    </div>
  );
}
