"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";

const IDENTITY = ["Builder", "Consultant", "President", "Creator"];
const BASE_DELAY = 0.15;
const STAGGER = 0.08;

export default function IdentityChips() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <ul className="flex flex-wrap items-center justify-center gap-3">
      {IDENTITY.map((item, index) => (
        <motion.li
          key={item}
          className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.6,
                  delay: BASE_DELAY + index * STAGGER,
                  ease: EASE_SIGNATURE,
                }
          }
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}
