"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useWorldStop } from "@/components/world/useWorldStop";
import { documentTop } from "@/lib/world";

const MAX_DEPTH_M = 2400;

/**
 * The descent — the site's signature beat. A tall section whose content is pinned (CSS
 * sticky) while scroll drives the world: the sand opens into a maw that swallows the
 * screen (first ~60%), then its throat turns to open night sky full of stars (last ~60%).
 * Two lines of type surface over the dark throat, and a depth readout counts the fall.
 */
export default function Descent() {
  const ref = useRef<HTMLElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);

  const span = (el: HTMLElement, vh: number) => Math.max(el.offsetHeight - vh, 1);
  useWorldStop(ref, { maw: 1, figure: 0 }, (el, vh) => {
    const top = documentTop(el);
    return [top - vh * 0.1, top + span(el, vh) * 0.6];
  });
  useWorldStop(ref, { night: 1 }, (el, vh) => {
    const top = documentTop(el);
    return [top + span(el, vh) * 0.4, top + span(el, vh)];
  });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // line A only surfaces once the maw is wide enough that it sits on the dark throat
  const lineA = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const lineAy = useTransform(scrollYProgress, [0.3, 0.6], [24, -24]);
  const lineB = useTransform(scrollYProgress, [0.58, 0.7, 0.88, 0.98], [0, 1, 1, 0]);
  const lineBy = useTransform(scrollYProgress, [0.58, 0.98], [24, -24]);
  const readout = useTransform(scrollYProgress, [0.12, 0.2, 0.92, 1], [0, 1, 1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (depthRef.current) {
      depthRef.current.textContent = String(Math.round(p * MAX_DEPTH_M)).padStart(4, "0");
    }
  });

  return (
    <section ref={ref} id="descent" aria-label="Descent" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-5 text-center">
        <motion.p
          style={{ opacity: lineA, y: lineAy }}
          className="absolute max-w-3xl font-display text-[clamp(1.5rem,4.6vw,4rem)] font-bold uppercase leading-[1.05] tracking-tight text-bone"
        >
          Beneath the sand
        </motion.p>
        <motion.p
          style={{ opacity: lineB, y: lineBy }}
          className="absolute max-w-3xl font-display text-[clamp(1.5rem,4.6vw,4rem)] font-bold uppercase leading-[1.05] tracking-tight text-bone"
        >
          Everything
          <br />
          I&apos;ve built
        </motion.p>

        <motion.div
          aria-hidden="true"
          style={{ opacity: readout }}
          className="absolute bottom-7 left-5 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60 sm:left-8"
        >
          Depth <span ref={depthRef}>0000</span> m
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ opacity: readout }}
          className="absolute bottom-7 right-5 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60 sm:right-8"
        >
          Keep falling
        </motion.div>
      </div>
    </section>
  );
}
