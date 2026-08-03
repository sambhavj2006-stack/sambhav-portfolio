"use client";

import { motion } from "motion/react";
import { useAmbientParallax } from "@/components/system/useAmbientParallax";

export default function HeroHeading() {
  const { x, y } = useAmbientParallax(1, 6);

  return (
    <motion.div
      className="flex flex-col items-center gap-6 text-center"
      style={{ x, y }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        Sambhav Jain
      </span>
      <h1 className="max-w-3xl text-balance text-[clamp(2.25rem,5vw+1rem,4.5rem)] font-semibold leading-[1.1] tracking-tight text-zinc-900">
        Turning meh into memorable through storytelling.
      </h1>
    </motion.div>
  );
}
