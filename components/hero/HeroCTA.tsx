"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/system/Magnetic";
import { useAmbientParallax } from "@/components/system/useAmbientParallax";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";
import { LINKS } from "@/lib/links";

export default function HeroCTA() {
  const prefersReducedMotion = useSettledReducedMotion();
  const { x, y } = useAmbientParallax(1.2, 10);

  return (
    <motion.div
      style={{ x, y }}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.6, delay: 0.55, ease: EASE_SIGNATURE }
      }
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Magnetic>
          <Button href="#projects" variant="primary">
            See the work
          </Button>
        </Magnetic>
        <Magnetic>
          <Button
            href={LINKS.resume}
            variant="secondary"
            ariaLabel="View résumé (opens in new tab)"
          >
            Résumé
          </Button>
        </Magnetic>
      </div>
    </motion.div>
  );
}
