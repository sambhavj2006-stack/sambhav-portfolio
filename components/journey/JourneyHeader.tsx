"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";

export default function JourneyHeader() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_SIGNATURE }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        Journey
      </span>
      <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
        A career built on momentum.
      </h2>
    </motion.div>
  );
}
