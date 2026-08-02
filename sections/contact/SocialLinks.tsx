"use client";

import { motion, useReducedMotion } from "motion/react";
import { socialLinks } from "@/data/social-links";
import { EASE_SIGNATURE, isExternalLink } from "@/lib/motion";

export default function SocialLinks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.ul
      className="flex flex-wrap items-center justify-center gap-6"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.3, ease: EASE_SIGNATURE }}
    >
      {socialLinks.map((link) => {
        const external = isExternalLink(link.href);
        return (
          <li key={link.label}>
            <a
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="rounded-sm text-sm font-medium text-zinc-500 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          </li>
        );
      })}
    </motion.ul>
  );
}
