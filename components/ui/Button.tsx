"use client";

import { motion } from "motion/react";
import type { TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { SPRING_TRANSITION, isExternalLink } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: `rounded-full bg-zinc-900 px-8 py-4 text-base font-medium text-white transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-700 ${FOCUS_RING}`,
  secondary: `rounded-full border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-300 hover:text-zinc-900 ${FOCUS_RING}`,
};

const HOVER_ELEVATION: Record<ButtonVariant, TargetAndTransition> = {
  primary: { y: -2, boxShadow: "0 10px 24px -10px rgba(0,0,0,0.3)" },
  secondary: { y: -1 },
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const prefersReducedMotion = useSettledReducedMotion();
  const external = isExternalLink(href);

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center justify-center ${VARIANT_STYLES[variant]} ${className}`}
      whileHover={prefersReducedMotion ? undefined : HOVER_ELEVATION[variant]}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
      transition={SPRING_TRANSITION}
    >
      {children}
    </motion.a>
  );
}
