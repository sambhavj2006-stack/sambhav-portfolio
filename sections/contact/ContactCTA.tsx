"use client";

import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { contactContent } from "@/data/contact";
import { EASE_SIGNATURE } from "@/lib/motion";

export default function ContactCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center gap-4 sm:flex-row"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: EASE_SIGNATURE }}
    >
      <Button href={contactContent.primaryCta.href} variant="primary">
        {contactContent.primaryCta.label}
      </Button>
      <Button href={contactContent.secondaryCta.href} variant="secondary">
        {contactContent.secondaryCta.label}
      </Button>
    </motion.div>
  );
}
