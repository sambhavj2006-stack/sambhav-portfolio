"use client";

import { motion } from "motion/react";
import Reveal from "@/components/system/Reveal";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { SPRING_TRANSITION } from "@/lib/motion";
import { contactContent } from "@/data/contact";

const STAGGER = 0.06;

export default function AvailabilityCard() {
  const { availability } = contactContent;
  const prefersReducedMotion = useSettledReducedMotion();

  return (
    <Reveal
      className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-neutral-50 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-8px_rgba(0,0,0,0.09)]"
      delay={0.2}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        {availability.title}
      </span>

      <div className="mt-5 flex flex-col">
        {availability.items.map((item, index) => (
          <Reveal key={item.role} delay={0.2 + index * STAGGER}>
            <motion.div
              className="-mx-3 flex items-baseline justify-between gap-4 rounded-lg px-3 py-3 text-left"
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -2, backgroundColor: "rgba(0,0,0,0.03)" }
              }
              transition={SPRING_TRANSITION}
            >
              <span className="text-sm font-semibold text-zinc-900">{item.role}</span>
              <span className="text-sm text-zinc-500">{item.organization}</span>
            </motion.div>
            {index < availability.items.length - 1 && (
              <div className="border-t border-zinc-200" aria-hidden="true" />
            )}
          </Reveal>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-zinc-200 pt-6">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          Open for
        </span>
        <ul className="flex flex-wrap gap-2">
          {availability.openFor.map((item) => (
            <li
              key={item}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 border-t border-zinc-200 pt-6">
        <motion.span
          className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"
          animate={
            prefersReducedMotion
              ? undefined
              : { opacity: [0.65, 1, 0.65], scale: [1, 1.15, 1] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <span className="text-sm font-medium text-zinc-600">
          {availability.statusText}
        </span>
      </div>
    </Reveal>
  );
}
