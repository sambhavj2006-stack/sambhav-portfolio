"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { journeyMilestones } from "@/data/journey-milestones";
import { INERTIA_SPRING } from "@/lib/motion";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import JourneyMilestone from "./JourneyMilestone";
import JourneyTrophy from "./JourneyTrophy";

const SNAP_TOLERANCE = 0.02;

/**
 * Sambhav OS scroll behaviour: the timeline draws itself in as you scroll through it — a
 * thin rail that fills top to bottom, tied 1:1 to scroll position (not autoplaying, so
 * it stays fine under reduced motion — only the smoothing spring is skipped). The rail
 * (and the trophy that rides it) is part of the timeline at every breakpoint, not a
 * desktop-only flourish.
 */
export default function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [milestoneFractions, setMilestoneFractions] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const prefersReducedMotion = useSettledReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const smoothProgress = useSpring(scrollYProgress, INERTIA_SPRING);
  const progress = prefersReducedMotion ? scrollYProgress : smoothProgress;

  // Measure each milestone row's real position so the trophy's mid-scroll "snap" lines up
  // with where the rows actually sit, not an assumed even split.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const total = container.offsetHeight;
      if (!total) return;
      setMilestoneFractions(
        rowRefs.current.map((row) => (row ? row.offsetTop / total : 0))
      );
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    if (!milestoneFractions.length) return;
    let next = 0;
    for (let i = 0; i < milestoneFractions.length; i++) {
      if (value >= milestoneFractions[i] - SNAP_TOLERANCE) next = i;
    }
    setActiveIndex((current) => (current === next ? current : next));
  });

  return (
    <div
      ref={containerRef}
      className="relative border-b border-zinc-200 pl-5 sm:pl-6 md:pl-7 lg:pl-8 xl:pl-12"
    >
      {/* Aligned to the section's own left margin (same as the heading above it), so the
          rail reads as an extension of the content's edge — an architectural guide the
          milestones sit a deliberate distance to the right of, never touching it. */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 w-px origin-top bg-zinc-900"
        style={{ height: "100%", scaleY: progress }}
      />
      <JourneyTrophy
        progress={progress}
        activeIndex={activeIndex}
        prefersReducedMotion={prefersReducedMotion}
      />
      {journeyMilestones.map((milestone, index) => (
        <div
          key={milestone.id}
          ref={(el) => {
            rowRefs.current[index] = el;
          }}
        >
          <JourneyMilestone {...milestone} index={index} />
        </div>
      ))}
    </div>
  );
}
