"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";
import { LINKS } from "@/lib/links";

const ROLES = ["Builder", "Consultant", "President", "Creator"];
const NAME = ["SAMBHAV", "JAIN"];

/**
 * Arrival. The name is drawn twice: as this real <h1> (layout, accessibility, the
 * no-WebGL / reduced-motion fallback) and as sand in the world canvas, which samples
 * this h1's letters and then hides its glyphs (see SandName). Letters are static spans —
 * no transforms — so the sand always matches their laid-out positions.
 */
export default function Hero() {
  const reduced = useSettledReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1.1, delay, ease: EASE_SIGNATURE },
        };

  return (
    <section
      id="top"
      className="relative flex h-svh min-h-[640px] flex-col items-center px-5 pt-[15vh] text-center text-ink sm:pt-[14vh]"
    >
      <motion.p
        {...rise(1.4)}
        className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.32em] sm:text-[11px]"
      >
        {ROLES.map((role, i) => (
          <span key={role} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/40" />}
            {role}
          </span>
        ))}
      </motion.p>

      <motion.h1
        id="hero-name"
        aria-label="Sambhav Jain"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: EASE_SIGNATURE }}
        className="mt-6 select-none font-display text-[clamp(2.6rem,10.5vw,10rem)] font-bold leading-[0.92] tracking-[-0.02em]"
      >
        {NAME.map((word) => (
          <span key={word} aria-hidden="true" className="block">
            {word.split("").map((letter, i) => (
              <span key={i} data-letter className="inline-block">
                {letter}
              </span>
            ))}
          </span>
        ))}
      </motion.h1>

      <motion.p
        {...rise(1.9)}
        className="mt-6 max-w-md text-balance text-base leading-relaxed text-ink/75 sm:text-lg"
      >
        Turning meh into memorable through storytelling. Everything I&apos;ve built lives
        below the sand.
      </motion.p>

      <motion.div {...rise(2.1)} className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="#descent" variant="ink">
          Descend
        </Button>
        <Button href={LINKS.resume} variant="ghost" ariaLabel="Résumé (opens in new tab)">
          Résumé
        </Button>
      </motion.div>

      <motion.a
        href="#descent"
        {...rise(2.6)}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-bone/80"
      >
        Scroll to descend
        <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-bone/25">
          {!reduced && (
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-bone"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: EASE_SIGNATURE }}
            />
          )}
        </span>
      </motion.a>
    </section>
  );
}
