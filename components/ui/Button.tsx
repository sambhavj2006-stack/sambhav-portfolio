"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { SPRING_HOVER, shouldOpenInNewTab } from "@/lib/motion";

/**
 * - `solid`: bone pill — primary action on night surfaces
 * - `ghost`: hairline pill in the current text colour — secondary action anywhere
 * - `ink`: umber pill — primary action over the bright day sky (hero)
 */
type ButtonVariant = "solid" | "ghost" | "ink";

const VARIANTS: Record<ButtonVariant, string> = {
  solid: "bg-bone text-night hover:bg-sand",
  ghost: "border border-current/25 hover:border-current/60",
  ink: "bg-ink text-bone hover:bg-rust",
};

export default function Button({
  href,
  children,
  variant = "solid",
  className = "",
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useSettledReducedMotion();
  const newTab = shouldOpenInNewTab(href);

  return (
    <motion.a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${VARIANTS[variant]} ${className}`}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={SPRING_HOVER}
    >
      {children}
    </motion.a>
  );
}
