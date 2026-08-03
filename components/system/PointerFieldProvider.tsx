"use client";

import { useEffect, useMemo, useState } from "react";
import { useMotionValue, useScroll } from "motion/react";
import { PointerFieldContext, type PointerFieldValue } from "./PointerFieldContext";
import { useSettledReducedMotion } from "./useSettledReducedMotion";

const SPEED_DECAY = 0.9;
const SPEED_SETTLE_THRESHOLD = 0.02;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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
  const { scrollYProgress: scrollProgress } = useScroll();
  // Internal only (never rendered), so reading window during the client's first
  // render can't cause a hydration mismatch — it just decides listener wiring below.
  const [isCoarsePointer] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false
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

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (decayId !== null) cancelAnimationFrame(decayId);
    };
  }, [prefersReducedMotion, isCoarsePointer, x, y, nx, ny, speed, presence]);

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
      prefersReducedMotion,
      isCoarsePointer,
    }),
    [x, y, nx, ny, speed, presence, elapsed, scrollProgress, prefersReducedMotion, isCoarsePointer]
  );

  return (
    <PointerFieldContext.Provider value={value}>{children}</PointerFieldContext.Provider>
  );
}
