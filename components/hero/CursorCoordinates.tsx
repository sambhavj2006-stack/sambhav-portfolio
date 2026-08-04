"use client";

import { useContext, useRef } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import { useSurfaceField } from "@/components/system/useSurfaceField";
import { CROSSHAIR_OPACITY, type CursorVariant } from "@/lib/motionSystem";
import { CursorContext } from "./cursor-context";

/**
 * A small blueprint-style coordinate readout that trails the cursor across the Hero —
 * "you are standing on a drafting surface." VisionOS-style restraint: it only shows
 * itself over genuinely empty canvas (CROSSHAIR_OPACITY["default"], a quiet 0.5, never a
 * full 1) and fades to nothing the instant the pointer crosses onto anything readable or
 * interactive — the headline, a chip, a button — via the same `cursorTarget` the cursor
 * instrument reads, so it never competes with content. Position and text are written
 * straight to the DOM (no React state, no re-render).
 */
export default function CursorCoordinates() {
  const cursor = useContext(CursorContext);
  const field = useSurfaceField();
  const fallback = useMotionValue(0);
  const fallbackVariant = useMotionValue<CursorVariant>("default");
  const labelRef = useRef<HTMLDivElement>(null);

  const pointerX = cursor?.pointerX ?? fallback;
  const pointerY = cursor?.pointerY ?? fallback;
  const cursorTarget = field?.cursorTarget ?? fallbackVariant;

  const update = () => {
    const el = labelRef.current;
    if (!el) return;
    const x = Math.round(pointerX.get());
    const y = Math.round(pointerY.get());
    const present = field && field.presence.get() > 0;
    const opacity = present ? CROSSHAIR_OPACITY[cursorTarget.get()] : 0;
    el.style.transform = `translate3d(${x + 18}px, ${y + 14}px, 0)`;
    el.style.opacity = String(opacity);
    el.textContent = `X${x} · Y${y}`;
  };

  useMotionValueEvent(pointerX, "change", update);
  useMotionValueEvent(pointerY, "change", update);
  useMotionValueEvent(cursorTarget, "change", update);

  if (!cursor || !field || field.prefersReducedMotion || field.isCoarsePointer) {
    return null;
  }

  return (
    <div
      ref={labelRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] tracking-wide text-zinc-400 opacity-0 transition-opacity duration-300 ease-out"
      style={{ willChange: "transform" }}
    />
  );
}
