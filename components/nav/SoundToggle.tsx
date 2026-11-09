"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { sound } from "@/lib/sound";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";

const BARS = [0.45, 1, 0.7, 0.9];

/**
 * Sound is off until the visitor asks for it (autoplaying audio is hostile, and browsers
 * block it anyway). Four bars: flat when off, breathing when on.
 */
export default function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSyncExternalStore(
    (cb) => sound.subscribe(cb),
    () => sound.on,
    () => false
  );
  const reduced = useSettledReducedMotion();

  return (
    <button
      type="button"
      onClick={() => sound.toggle()}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className={`group flex items-center gap-2.5 rounded-sm font-mono text-[11px] uppercase tracking-[0.22em] transition-opacity duration-300 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye ${className}`}
    >
      <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
        {BARS.map((peak, i) => (
          <motion.span
            key={i}
            className="w-[2px] origin-bottom bg-current"
            style={{ height: "100%" }}
            animate={
              on && !reduced
                ? { scaleY: [0.25, peak, 0.35, peak * 0.8, 0.25] }
                : { scaleY: on ? peak : 0.2 }
            }
            transition={
              on && !reduced
                ? { duration: 1.6 + i * 0.25, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          />
        ))}
      </span>
      Sound {on ? "on" : "off"}
    </button>
  );
}
