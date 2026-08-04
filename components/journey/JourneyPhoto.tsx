"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { SPRING_TRANSITION } from "@/lib/motion";
import type { JourneyPhoto as JourneyPhotoType } from "@/types/journey-milestone";

const HOVER_SHADOW = "0 2px 4px rgba(0,0,0,0.08), 0 24px 48px -12px rgba(0,0,0,0.2)";

/**
 * A single contextual supporting photo for a Journey milestone — not a gallery, one
 * tasteful image per row at most. Same rounded-2xl / tier-1 shadow / hover-lift language
 * as FloatingCard and InfoCard, so it reads as native to the system rather than a bolted-on
 * media block.
 */
export default function JourneyPhoto({ src, alt }: JourneyPhotoType) {
  const prefersReducedMotion = useSettledReducedMotion();

  return (
    <motion.div
      className="w-full shrink-0 overflow-hidden rounded-2xl border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_20px_40px_-12px_rgba(0,0,0,0.16)] sm:w-56 lg:w-52 xl:w-60"
      whileHover={
        prefersReducedMotion ? undefined : { y: -4, boxShadow: HOVER_SHADOW }
      }
      transition={SPRING_TRANSITION}
    >
      <Image
        src={src}
        alt={alt}
        width={480}
        height={360}
        loading="lazy"
        sizes="(min-width: 1280px) 15rem, (min-width: 640px) 14rem, 100vw"
        className="aspect-4/3 h-auto w-full object-cover"
      />
    </motion.div>
  );
}
