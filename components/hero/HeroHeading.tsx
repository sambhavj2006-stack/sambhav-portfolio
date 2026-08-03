"use client";

import { motion } from "motion/react";
import { useAmbientParallax } from "@/components/system/useAmbientParallax";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";

const HEADLINE = "Turning meh into memorable through storytelling.";
const WORDS = HEADLINE.split(" ");
const BASE_DELAY = 0.2;
const STAGGER = 0.045;

export default function HeroHeading() {
  const { x, y } = useAmbientParallax(1, 6);
  const prefersReducedMotion = useSettledReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center gap-6 text-center"
      style={{ x, y }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        Sambhav Jain
      </span>
      <h1 className="max-w-3xl text-balance text-[clamp(2.25rem,5vw+1rem,4.5rem)] font-semibold leading-[1.1] tracking-tight text-zinc-900">
        {WORDS.map((word, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden pb-1 align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={prefersReducedMotion ? false : { y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.7,
                delay: BASE_DELAY + index * STAGGER,
                ease: EASE_SIGNATURE,
              }}
            >
              {word}
              {index < WORDS.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </h1>
    </motion.div>
  );
}
