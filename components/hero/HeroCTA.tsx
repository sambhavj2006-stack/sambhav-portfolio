"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";

export default function HeroCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href="#projects"
      className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 hover:bg-zinc-700"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.6, delay: 0.55, ease: EASE_SIGNATURE }
      }
    >
      See the work
    </motion.a>
  );
}
