"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useMotionValue, useScroll } from "motion/react";
import { PointerFieldContext, type PointerFieldValue } from "./PointerFieldContext";
import { useSettledReducedMotion } from "./useSettledReducedMotion";
import { CURSOR_RING_SCALE, type CursorVariant } from "@/lib/motionSystem";

const SPEED_DECAY = 0.9;
const SPEED_SETTLE_THRESHOLD = 0.02;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * What kind of surface the pointer is over, for the cursor instrument and the Hero
 * coordinate readout. `data-cursor` on an element wins outright; otherwise a handful of
 * tag-based fallbacks cover links/buttons and readable text (headings, paragraphs, list
 * items — chips included) without needing to annotate every element by hand.
 */
function resolveCursorVariant(target: EventTarget | null): CursorVariant {
  if (!(target instanceof Element)) return "default";
  const withData = target.closest("[data-cursor]");
  if (withData) {
    const value = withData.getAttribute("data-cursor");
    if (value && value in CURSOR_RING_SCALE) return value as CursorVariant;
  }
  if (target.closest("a, button")) return "click";
  if (target.closest("h1, h2, h3, p, li")) return "text";
  return "default";
}

/**
 * Mounts once (in SiteShell) and owns the only window-level pointermove listener in the
 * app. Everything that reacts to the cursor — the engineering grid, the hero glow,
 * magnetic buttons, floating cards — reads from this instead of attaching its own
 * listener. Values are plain motion values (no React state), so a moving cursor never
 * triggers a re-render anywhere downstream.
 */
export default function PointerFieldProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useSettledReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const speed = useMotionValue(0);
  const presence = useMotionValue(0);
  const elapsed = useMotionValue(0);
  const cursorTarget = useMotionValue<CursorVariant>("default");
  const { scrollYProgress: scrollProgress } = useScroll();
  // useSyncExternalStore guarantees the SERVER snapshot (false) is used for the client's
  // first paint too, then resyncs to the real matchMedia value right after hydration —
  // unlike a plain useState lazy initializer, which reads matchMedia synchronously on the
  // client's very first render and can disagree with the server, causing a mismatch.
  const isCoarsePointer = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion || isCoarsePointer) return;

    let rafId: number | null = null;
    let decayId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let pendingX = 0;
    let pendingY = 0;
    let hasPending = false;

    const runDecay = () => {
      const next = speed.get() * SPEED_DECAY;
      if (next < SPEED_SETTLE_THRESHOLD) {
        speed.set(0);
        decayId = null;
        return;
      }
      speed.set(next);
      decayId = requestAnimationFrame(runDecay);
    };

    const applyFrame = () => {
      rafId = null;
      if (!hasPending) return;
      hasPending = false;

      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const dx = pendingX - lastX;
      const dy = pendingY - lastY;
      const instantSpeed = clamp(Math.sqrt(dx * dx + dy * dy) / dt, 0, 4);

      lastX = pendingX;
      lastY = pendingY;
      lastT = now;

      x.set(pendingX);
      y.set(pendingY);
      nx.set(clamp((pendingX - window.innerWidth / 2) / (window.innerWidth / 2), -1, 1));
      ny.set(clamp((pendingY - window.innerHeight / 2) / (window.innerHeight / 2), -1, 1));
      if (instantSpeed > speed.get()) speed.set(instantSpeed);
      presence.set(1);

      if (decayId === null) decayId = requestAnimationFrame(runDecay);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
      hasPending = true;
      if (rafId === null) rafId = requestAnimationFrame(applyFrame);
    };

    const handlePointerLeave = () => {
      presence.set(0);
      speed.set(0);
    };

    // One low-frequency listener for the whole app: pointerover only fires on element-
    // boundary crossings, not continuously, so this is effectively free while the cursor
    // sits still or travels within the same element. Both CursorInstrument (ring/dot
    // shape) and the Hero coordinate readout (visibility) read this single value.
    const handlePointerOver = (event: PointerEvent) => {
      cursorTarget.set(resolveCursorVariant(event.target));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("pointerover", handlePointerOver, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("pointerover", handlePointerOver);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (decayId !== null) cancelAnimationFrame(decayId);
    };
  }, [prefersReducedMotion, isCoarsePointer, x, y, nx, ny, speed, presence, cursorTarget]);

  // The engine's shared clock: one rAF loop drives procedural drift for every widget
  // instead of each mounting its own timer. Reduced motion means no drift, so no clock.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const start = performance.now();
    let rafId = requestAnimationFrame(function tick(now) {
      elapsed.set((now - start) / 1000);
      rafId = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, elapsed]);

  const value = useMemo<PointerFieldValue>(
    () => ({
      x,
      y,
      nx,
      ny,
      speed,
      presence,
      elapsed,
      scrollProgress,
      cursorTarget,
      prefersReducedMotion,
      isCoarsePointer,
    }),
    [
      x,
      y,
      nx,
      ny,
      speed,
      presence,
      elapsed,
      scrollProgress,
      cursorTarget,
      prefersReducedMotion,
      isCoarsePointer,
    ]
  );

  return (
    <PointerFieldContext.Provider value={value}>{children}</PointerFieldContext.Provider>
  );
}
