"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";
import { useSettledReducedMotion } from "./useSettledReducedMotion";

const SECTIONS = [
  { id: "hero", label: "INTRO" },
  { id: "journey", label: "JOURNEY" },
  { id: "contact", label: "CONTACT" },
];

/**
 * Sambhav OS chrome: a small coordinate readout that names whichever section is
 * currently under the viewport, like a label on an engineering drawing. Purely
 * decorative — aria-hidden, since Navigation already exposes this structure
 * accessibly.
 */
export default function SectionCoordinateReadout() {
  const prefersReducedMotion = useSettledReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = SECTIONS.findIndex(({ id }) => id === visible.target.id);
        if (index !== -1) setActiveIndex(index);
      },
      { threshold: [0.35, 0.5, 0.65] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const active = SECTIONS[activeIndex];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-6 z-40 hidden font-mono text-[11px] tracking-[0.15em] text-zinc-400 md:block"
    >
      <span className="text-zinc-300">{String(activeIndex + 1).padStart(2, "0")}</span>
      <span className="mx-1.5 text-zinc-300">—</span>
      {prefersReducedMotion ? (
        <span>{active.label}</span>
      ) : (
        <AnimatePresence mode="wait">
          <motion.span
            key={active.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE_SIGNATURE }}
            className="inline-block"
          >
            {active.label}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}
