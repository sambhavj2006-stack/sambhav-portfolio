"use client";

import { motion, useReducedMotion } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { contactContent } from "@/data/contact";
import { EASE_SIGNATURE } from "@/lib/motion";

export default function ContactHeader() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_SIGNATURE }}
    >
      <SectionHeading
        heading={contactContent.headline}
        description={contactContent.description}
        align="center"
      />
    </motion.div>
  );
}
