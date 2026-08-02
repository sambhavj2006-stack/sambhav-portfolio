"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";
import type { JourneyMilestone as JourneyMilestoneType } from "@/types/journey-milestone";

const STAGGER = 0.08;
const MAX_STAGGER_DELAY = 0.24;

export default function JourneyMilestone({
  range,
  title,
  organization,
  description,
  index,
}: JourneyMilestoneType & { index: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 gap-3 border-t border-zinc-200 py-10 md:grid-cols-12 md:gap-8"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * STAGGER, MAX_STAGGER_DELAY),
        ease: EASE_SIGNATURE,
      }}
    >
      <span className="text-sm text-zinc-500 md:col-span-3">{range}</span>
      <div className="flex flex-col gap-1 md:col-span-9">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <span className="text-sm font-medium text-zinc-600">
          {organization}
        </span>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">{description}</p>
      </div>
    </motion.div>
  );
}
