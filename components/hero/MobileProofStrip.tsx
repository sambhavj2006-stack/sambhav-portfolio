"use client";

import { motion } from "motion/react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";

const PROOF_ITEMS = ["Live: Krafton India", "8.7K+ community"];
const BASE_DELAY = 0.6;
const STAGGER = 0.08;

/**
 * The floating proof cards are desktop/tablet-only (absolute positioning gets fragile at
 * mobile widths). Below md, this fills the same "proof" role in-flow, reusing
 * IdentityChips' exact pill styling so it reads as the same design language, not a new
 * component bolted on.
 */
export default function MobileProofStrip() {
  const prefersReducedMotion = useSettledReducedMotion();

  return (
    <ul className="flex flex-wrap items-center justify-center gap-3 md:hidden">
      {PROOF_ITEMS.map((item, index) => (
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
