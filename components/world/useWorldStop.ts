"use client";

import { useEffect, type RefObject } from "react";
import { documentTop, registerWorldStop, type WorldMood } from "@/lib/world";

/**
 * Declares the mood the desert should reach as this section scrolls in. By default the
 * transition runs from the section's top touching the bottom of the viewport until its
 * top reaches 25% down — i.e. the world finishes changing just as the section settles.
 */
export function useWorldStop(
  ref: RefObject<HTMLElement | null>,
  mood: Partial<WorldMood>,
  range?: (el: HTMLElement, vh: number) => [number, number]
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerWorldStop({
      mood,
      range: () => {
        const vh = window.innerHeight;
        if (range) return range(el, vh);
        const top = documentTop(el);
        return [top - vh, top - vh * 0.25];
      },
    });
    // mood/range are static per section; registering once is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
