"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/system/Magnetic";
import { useAmbientParallax } from "@/components/system/useAmbientParallax";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";

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
      <Magnetic>
        <Button href="#projects" variant="primary">
          See the work
        </Button>
      </Magnetic>
    </motion.div>
  );
}
