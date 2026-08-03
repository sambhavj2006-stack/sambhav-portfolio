"use client";

import { useContext, useRef } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import { useSurfaceField } from "@/components/system/useSurfaceField";
import { CursorContext } from "./cursor-context";

/**
 * A small blueprint-style coordinate readout that trails the cursor across the Hero —
 * "you are standing on a drafting surface." Fires on every cursor tick, so position and
 * text are written straight to the DOM (no React state, no re-render).
 */
export default function CursorCoordinates() {
  const cursor = useContext(CursorContext);
  const field = useSurfaceField();
  const fallback = useMotionValue(0);
  const labelRef = useRef<HTMLDivElement>(null);

  const pointerX = cursor?.pointerX ?? fallback;
  const pointerY = cursor?.pointerY ?? fallback;

  const update = () => {
    const el = labelRef.current;
    if (!el) return;
    const x = Math.round(pointerX.get());
    const y = Math.round(pointerY.get());
    el.style.transform = `translate3d(${x + 18}px, ${y + 14}px, 0)`;
    el.style.opacity = field && field.presence.get() > 0 ? "1" : "0";
    el.textContent = `X${x} · Y${y}`;
  };

  useMotionValueEvent(pointerX, "change", update);
  useMotionValueEvent(pointerY, "change", update);

  if (!cursor || !field || field.prefersReducedMotion || field.isCoarsePointer) {
    return null;
  }

  return (
    <div
      ref={labelRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] tracking-wide text-zinc-400 opacity-0 transition-opacity duration-500"
      style={{ willChange: "transform" }}
    />
  );
}
