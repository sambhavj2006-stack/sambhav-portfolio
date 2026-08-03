"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useMotionValueEvent, useSpring } from "motion/react";
import { MAGNETIC_SPRING } from "@/lib/motion";
import { useSurfaceField } from "./useSurfaceField";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** px radius within which the element starts feeling the pull */
  radius?: number;
  /** 0-1, fraction of the cursor offset the element actually travels — keep this subtle */
  strength?: number;
};

/**
 * Sambhav OS magnetic behaviour: important targets (primary CTAs, nav marks) feel the
 * cursor before it arrives and lean toward it, then settle with an overdamped spring.
 * Reads off the shared PointerField instead of its own listener — the pull is computed
 * from motion-value change events, so a stationary cursor costs nothing.
 */
export default function Magnetic({
  children,
  className = "inline-block",
  radius = 80,
  strength = 0.35,
}: MagneticProps) {
  const field = useSurfaceField();
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const springX = useSpring(pullX, MAGNETIC_SPRING);
  const springY = useSpring(pullY, MAGNETIC_SPRING);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", measure);
    };
  }, []);

  const applyPull = () => {
    if (!field) return;
    const rect = rectRef.current;
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = field.x.get() - cx;
    const dy = field.y.get() - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius && field.presence.get() > 0) {
      const falloff = 1 - dist / radius;
      pullX.set(dx * strength * falloff);
      pullY.set(dy * strength * falloff);
    } else {
      pullX.set(0);
      pullY.set(0);
    }
  };

  useMotionValueEvent(field?.x ?? pullX, "change", applyPull);
  useMotionValueEvent(field?.y ?? pullY, "change", applyPull);

  if (!field || field.prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // No cursor to feel on a touch device, so the magnetic pull has no equivalent — instead
  // the target yields slightly under the finger, the same overdamped spring giving it the
  // tap its own tactile weight.
  if (field.isCoarsePointer) {
    return (
      <motion.div
        className={className}
        whileTap={{ scale: 0.94 }}
        transition={MAGNETIC_SPRING}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      data-cursor="pull"
      className={className}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
