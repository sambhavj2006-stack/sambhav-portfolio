"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useMotionValue, useReducedMotion } from "motion/react";
import { CursorContext } from "./cursor-context";
import FloatingCard from "./FloatingCard";
import CursorGlow from "./CursorGlow";
import type { FloatingObjectConfig } from "@/types/floating-object";

const GLOW_SIZE = 640;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function CursorField({
  objects,
}: {
  objects: FloatingObjectConfig[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  // Client's first render must match SSR's assumption (no window) to avoid a
  // hydration mismatch, since useReducedMotion() resolves synchronously on mount.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = wrapperRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      glowX.set(rect.width / 2 - GLOW_SIZE / 2);
      glowY.set(rect.height / 2 - GLOW_SIZE / 2);
    }

    const updateFromPoint = (clientX: number, clientY: number) => {
      const node = wrapperRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const relX = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouseX.set(clamp(relX, -1, 1));
      mouseY.set(clamp(relY, -1, 1));
      glowX.set(clientX - rect.left - GLOW_SIZE / 2);
      glowY.set(clientY - rect.top - GLOW_SIZE / 2);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        updateFromPoint(event.clientX, event.clientY);
      });
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [mouseX, mouseY, glowX, glowY, prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <CursorContext.Provider value={{ mouseX, mouseY, glowX, glowY }}>
        {mounted && !prefersReducedMotion && <CursorGlow />}
        {objects.map((object) => (
          <FloatingCard key={object.id} {...object} />
        ))}
      </CursorContext.Provider>
    </div>
  );
}
