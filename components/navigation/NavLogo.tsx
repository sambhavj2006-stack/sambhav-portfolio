"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Magnetic from "@/components/system/Magnetic";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { SPRING_TACTILE } from "@/lib/motionSystem";
import headshot from "@/public/photos/hero/hero-headshot.jpeg";

/**
 * Sambhav OS identity mark — the same professional headshot as the Hero, cropped into a
 * small circular avatar beside the wordmark (the GitHub / Linear / Apple Developer
 * pattern). Sits inside the existing Magnetic wrapper, so it inherits the site's one
 * magnetic-pull behaviour rather than inventing a second one; the avatar itself adds only
 * a spring scale on hover/tap, via the shared SPRING_TACTILE.
 */
export default function NavLogo({ scrolled }: { scrolled: boolean }) {
  const prefersReducedMotion = useSettledReducedMotion();

  return (
    <Magnetic radius={70} strength={0.3}>
      <a
        href="#hero"
        aria-label="Sambhav Jain — back to top"
        data-cursor="nav"
        className={`-m-2 inline-flex origin-left items-center gap-2.5 rounded-full p-2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${
          scrolled ? "scale-90" : "scale-100"
        }`}
      >
        <motion.span
          className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-full border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_10px_-4px_rgba(0,0,0,0.18)] sm:h-8 sm:w-8"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          transition={SPRING_TACTILE}
        >
          <Image
            src={headshot}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="32px"
            className="object-cover object-center"
          />
        </motion.span>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
          Sambhav Jain
        </span>
      </a>
    </Magnetic>
  );
}
