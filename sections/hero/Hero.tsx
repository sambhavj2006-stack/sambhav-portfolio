"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";
import { LINKS } from "@/lib/links";

const ROLES = ["Builder", "Consultant", "President", "Creator"];
const NAME = ["SAMBHAV", "JAIN"];

/**
 * Arrival. The name rises letter by letter out of the sand, sitting in the open day sky
 * of the painted world behind it (the world itself is the fixed backdrop). Type is ink
 * over the bright sky; the scroll cue sits lower, over the dunes, in bone.
 */
export default function Hero() {
  const reduced = useSettledReducedMotion();
  let letterIndex = 0;

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1.1, delay, ease: EASE_SIGNATURE },
        };

  return (
    <section
      id="top"
      className="relative flex h-svh min-h-[640px] flex-col items-center px-5 pt-[15vh] text-center text-ink sm:pt-[14vh]"
    >
      <motion.p
        {...rise(0.2)}
        className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.32em] sm:text-[11px]"
      >
        {ROLES.map((role, i) => (
          <span key={role} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/40" />}
            {role}
          </span>
        ))}
      </motion.p>

      <h1
        aria-label="Sambhav Jain"
        className="mt-6 font-display text-[clamp(2.6rem,10.5vw,10rem)] font-bold leading-[0.92] tracking-[-0.02em]"
      >
        {NAME.map((word) => (
          <span key={word} aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            {word.split("").map((letter) => {
              const i = letterIndex++;
              return (
                <motion.span
                  key={`${word}-${i}`}
                  className="inline-block"
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, delay: 0.35 + i * 0.05, ease: EASE_SIGNATURE }}
                >
                  {letter}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>

      <motion.p
        {...rise(1.1)}
        className="mt-6 max-w-md text-balance text-base leading-relaxed text-ink/75 sm:text-lg"
      >
        Turning meh into memorable through storytelling. Tools I&apos;ve built, work I&apos;ve
        done, and the trek so far.
      </motion.p>

      <motion.div {...rise(1.3)} className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="#descent" variant="ink">
          Descend
        </Button>
        <Button href={LINKS.resume} variant="ghost" ariaLabel="Résumé (opens in new tab)">
          Résumé
        </Button>
      </motion.div>

      <motion.a
        href="#descent"
        {...rise(1.8)}
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
