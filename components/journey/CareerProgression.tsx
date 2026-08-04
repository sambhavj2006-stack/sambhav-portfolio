"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";
import type { CareerProgressionStep } from "@/types/journey-milestone";

type CareerProgressionProps = {
  steps: CareerProgressionStep[];
  className?: string;
};

/**
 * Reusable internal-promotion rail — one org, several titles over time. Renders as a
 * compact stack instead of separate Journey milestones, so a promotion reads as growth
 * within one role rather than as three unrelated jobs. The most recent step opens by
 * default; hover/click (tap on touch) swaps which step is expanded.
 */
export default function CareerProgression({ steps, className = "" }: CareerProgressionProps) {
  const prefersReducedMotion = useSettledReducedMotion();
  const [openId, setOpenId] = useState<string | null>(steps[steps.length - 1]?.id ?? null);

  return (
    <ol className={`flex flex-col ${className}`}>
      {steps.map((step, index) => {
        const isCurrent = index === steps.length - 1;
        const isOpen = openId === step.id;
        const hasDetail = Boolean(step.description);

        return (
          <li key={step.id} className="relative pl-4">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="absolute left-[3px] top-0 h-3 w-px bg-zinc-200"
              />
            )}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-2.5 h-[6px] w-[6px] rounded-full ${
                isCurrent ? "bg-zinc-900" : "bg-zinc-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : step.id)}
              onMouseEnter={() => hasDetail && setOpenId(step.id)}
              className="-mx-2 flex w-full items-baseline justify-between gap-4 rounded-md px-2 py-2 text-left transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <span
                className={`text-sm font-medium ${
                  isCurrent ? "text-zinc-900" : "text-zinc-600"
                }`}
              >
                {step.title}
              </span>
              <span className="shrink-0 text-xs text-zinc-400">{step.range}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && step.description && (
                <motion.p
                  initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_SIGNATURE }}
                  className="overflow-hidden px-2 text-xs text-zinc-500"
                >
                  <span className="block pb-2">{step.description}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
