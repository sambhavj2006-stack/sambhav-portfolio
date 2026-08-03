"use client";

import { motion } from "motion/react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { SPRING_TRANSITION } from "@/lib/motion";
import OrgMark from "./OrgMark";

type InfoCardProps = {
  title: string;
  subtitle?: string;
  range: string;
  /** organization/host name to derive a monogram mark from — omit if there isn't one */
  markName?: string;
  className?: string;
};

// Same base shadow as FloatingCard's tier 3, so the hover lift here settles into the
// exact elevation the rest of the system already uses — one shared hover language.
const HOVER_SHADOW = "0 1px 2px rgba(0,0,0,0.05), 0 13px 28px -8px rgba(0,0,0,0.12)";

/**
 * Shared card shape for grid content (Builds, Awards) — same border/surface/shadow
 * language as AvailabilityCard, so new sections read as part of the existing system
 * rather than a new visual style.
 */
export default function InfoCard({
  title,
  subtitle,
  range,
  markName,
  className = "",
}: InfoCardProps) {
  const prefersReducedMotion = useSettledReducedMotion();

  return (
    <motion.div
      data-cursor="view"
      className={`flex h-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-neutral-50 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-8px_rgba(0,0,0,0.09)] ${className}`}
      whileHover={
        prefersReducedMotion ? undefined : { y: -4, boxShadow: HOVER_SHADOW }
      }
      transition={SPRING_TRANSITION}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          {range}
        </span>
        {markName && <OrgMark name={markName} />}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
