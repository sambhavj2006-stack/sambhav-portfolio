"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import { useSurfaceField } from "@/components/system/useSurfaceField";
import { CursorContext } from "./cursor-context";
import FloatingCard from "./FloatingCard";
import CursorGlow from "./CursorGlow";
import CursorCoordinates from "./CursorCoordinates";
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
  const rectRef = useRef<DOMRect | null>(null);
  const field = useSurfaceField();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  // field.prefersReducedMotion is already hydration-safe (settled post-mount at the
  // engine's source), so it's fine to trust directly here.
  const prefersReducedMotion = Boolean(field?.prefersReducedMotion);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    window.addEventListener("scroll", measure, { passive: true });

    const rect = el.getBoundingClientRect();
    glowX.set(rect.width / 2 - GLOW_SIZE / 2);
    glowY.set(rect.height / 2 - GLOW_SIZE / 2);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", measure);
    };
  }, [glowX, glowY]);

  const applyFromField = () => {
    if (!field) return;
    const rect = rectRef.current;
    if (!rect) return;
    if (field.presence.get() === 0) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }
    const clientX = field.x.get();
    const clientY = field.y.get();
    const relX = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(clamp(relX, -1, 1));
    mouseY.set(clamp(relY, -1, 1));
    glowX.set(clientX - rect.left - GLOW_SIZE / 2);
    glowY.set(clientY - rect.top - GLOW_SIZE / 2);
    pointerX.set(clientX - rect.left);
    pointerY.set(clientY - rect.top);
  };

  useMotionValueEvent(field?.x ?? mouseX, "change", applyFromField);
  useMotionValueEvent(field?.y ?? mouseY, "change", applyFromField);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <CursorContext.Provider
        value={{ mouseX, mouseY, glowX, glowY, pointerX, pointerY }}
      >
        {!prefersReducedMotion && field && <CursorGlow />}
        {!prefersReducedMotion && field && <CursorCoordinates />}
        {objects.map((object) => (
          <FloatingCard key={object.id} {...object} />
        ))}
      </CursorContext.Provider>
    </div>
  );
}
