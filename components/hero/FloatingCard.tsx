"use client";

import { useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import { CursorContext } from "./cursor-context";
import FloatingCardContent from "./FloatingCardContent";
import { EASE_SIGNATURE, SPRING_TRANSITION } from "@/lib/motion";
import { createDriftPhase, organicWave } from "@/lib/noise";
import { useSurfaceField } from "@/components/system/useSurfaceField";
import type { FloatingObjectConfig } from "@/types/floating-object";

/** ambient wide-field parallax, from normalized cursor position across the whole Hero */
const MAX_AMBIENT_TRANSLATE = 8;
const MAX_AMBIENT_TILT = 0.6; // deg — half of the ±1° micro-rotation budget
const MAX_DRIFT_TILT = 0.4; // deg — the other half, from procedural drift
const MAX_MICRO_TILT = 0.6; // deg — rotateX/rotateY budget, scaled by depth

/** local cursor-repulsion — the widget leans away as the pointer approaches, spring back on exit */
const REPULSION_RADIUS = 220;
const MAX_REPULSION = 18;

/**
 * Responsive motion density: desktop (≥1440, the flagship) gets the full amplitude;
 * laptop (1024–1439) is scaled down ~15%; tablet (<1024, already showing fewer/smaller
 * cards) gets a bigger cut on top of that. Read from the same rect-measuring effect that
 * already tracks the card's position — no extra listener.
 */
function motionScaleForWidth(width: number): number {
  if (width < 1024) return 0.7;
  if (width < 1440) return 0.85;
  return 1;
}

const TIER_STYLES: Record<
  FloatingObjectConfig["tier"],
  { border: string; surface: string; shadow: string; hoverShadow: string }
> = {
  1: {
    border: "border-zinc-200",
    surface: "bg-neutral-50",
    shadow:
      "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_20px_40px_-12px_rgba(0,0,0,0.16)]",
    hoverShadow: "0 2px 4px rgba(0,0,0,0.08), 0 24px 48px -12px rgba(0,0,0,0.2)",
  },
  2: {
    border: "border-zinc-200/80",
    surface: "bg-neutral-50/90",
    shadow:
      "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_14px_32px_-10px_rgba(0,0,0,0.12)]",
    hoverShadow:
      "0 1px 3px rgba(0,0,0,0.06), 0 18px 36px -10px rgba(0,0,0,0.15)",
  },
  3: {
    border: "border-zinc-200/60",
    surface: "bg-neutral-50/80",
    shadow:
      "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-8px_rgba(0,0,0,0.09)]",
    hoverShadow: "0 1px 2px rgba(0,0,0,0.05), 0 13px 28px -8px rgba(0,0,0,0.12)",
  },
  4: {
    border: "border-zinc-200/45",
    surface: "bg-neutral-50/65",
    shadow:
      "shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_18px_-8px_rgba(0,0,0,0.07)]",
    hoverShadow: "0 1px 2px rgba(0,0,0,0.04), 0 11px 22px -8px rgba(0,0,0,0.1)",
  },
  5: {
    border: "border-zinc-200/30",
    surface: "bg-neutral-50/50",
    shadow:
      "shadow-[0_1px_1px_rgba(0,0,0,0.02),0_6px_14px_-6px_rgba(0,0,0,0.05)]",
    hoverShadow: "0 1px 1px rgba(0,0,0,0.03), 0 9px 18px -6px rgba(0,0,0,0.08)",
  },
};

export default function FloatingCard({
  id,
  position,
  width,
  height,
  hideOnMobile,
  visibleFrom = "xl",
  tabletClassName,
  tier,
  animation,
}: FloatingObjectConfig) {
  const cursor = useContext(CursorContext);
  const field = useSurfaceField();
  const {
    depth,
    parallaxStrength,
    entranceDelay,
    hoverScale,
    mass,
    driftRadius,
    driftSpeed,
  } = animation;
  const tierStyle = TIER_STYLES[tier];

  const homeRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const motionScaleRef = useRef(1);

  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;
    const measure = () => {
      rectRef.current = el.getBoundingClientRect();
      motionScaleRef.current = motionScaleForWidth(window.innerWidth);
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

  // Stable per-widget noise phases, so no two cards breathe or tumble in sync.
  const phase = useMemo(() => createDriftPhase(id), [id]);
  const rxPhase = useMemo(() => createDriftPhase(`${id}:rx`), [id]);
  const ryPhase = useMemo(() => createDriftPhase(`${id}:ry`), [id]);

  // Procedural drift is non-zero even at t=0, so it must never render during SSR — the
  // server and the client's first paint have to agree exactly, or hydration mismatches.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const prefersReducedMotion = Boolean(field?.prefersReducedMotion);
  // Entrance keyframes are static numbers, safe pre-hydration; the continuously computed
  // drift/repulsion transform below is not, so only it waits on `mounted`.
  const entranceActive = !prefersReducedMotion;
  const engineActive = mounted && Boolean(field) && !prefersReducedMotion;

  const fallbackMouseX = useMotionValue(0);
  const fallbackMouseY = useMotionValue(0);
  const mouseX = cursor?.mouseX ?? fallbackMouseX;
  const mouseY = cursor?.mouseY ?? fallbackMouseY;

  // Ambient wide-field parallax — near layers (higher depth) answer the cursor more.
  // Function form (not the fixed range-mapping form) so the responsive motionScaleRef can
  // be folded in without a second transform stage.
  const ambientX = useTransform(
    mouseX,
    (v) => v * MAX_AMBIENT_TRANSLATE * parallaxStrength * motionScaleRef.current
  );
  const ambientY = useTransform(
    mouseY,
    (v) => v * MAX_AMBIENT_TRANSLATE * parallaxStrength * motionScaleRef.current
  );
  const ambientRotateZ = useTransform(
    mouseX,
    (v) => v * MAX_AMBIENT_TILT * parallaxStrength * motionScaleRef.current
  );

  // Local repulsion — computed from real screen distance, not the normalized ambient field.
  const pushX = useMotionValue(0);
  const pushY = useMotionValue(0);

  const applyRepulsion = () => {
    if (!field) return;
    const rect = rectRef.current;
    if (!rect || rect.width === 0 || field.presence.get() === 0) {
      pushX.set(0);
      pushY.set(0);
      return;
    }
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - field.x.get();
    const dy = cy - field.y.get();
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < REPULSION_RADIUS && dist > 0.001) {
      const falloff = 1 - dist / REPULSION_RADIUS;
      const strength =
        falloff * MAX_REPULSION * (0.4 + depth * 0.6) * motionScaleRef.current;
      pushX.set((dx / dist) * strength);
      pushY.set((dy / dist) * strength);
    } else {
      pushX.set(0);
      pushY.set(0);
    }
  };

  useMotionValueEvent(field?.x ?? pushX, "change", applyRepulsion);
  useMotionValueEvent(field?.y ?? pushY, "change", applyRepulsion);

  // Ambient parallax + repulsion settle through one mass-tuned spring — heavier widgets
  // (higher `mass`) drift less and take longer to arrive, exactly like real inertia.
  const settleSpring = { ...SPRING_TRANSITION, mass };
  const combinedX = useTransform([ambientX, pushX], ([a, p]) => (a as number) + (p as number));
  const combinedY = useTransform([ambientY, pushY], ([a, p]) => (a as number) + (p as number));
  const springX = useSpring(combinedX, settleSpring);
  const springY = useSpring(combinedY, settleSpring);
  const springRotateZ = useSpring(ambientRotateZ, settleSpring);

  // Procedural drift — three layered sine waves per axis, unique phase per widget, driven
  // by the engine's shared clock. This is what replaces the old repeating keyframe float.
  //
  // Performance: 3 of these 5 widgets stay `display:none` until lg (see visibilityClassName
  // below), but the shared clock ticks every rAF frame for the whole page regardless — so
  // every mounted card, hidden or not, would otherwise keep recomputing 5 sine-wave chains
  // 60x/second for nothing. `isVisible()` reads the last measured rect (already tracked for
  // repulsion, refreshed by the ResizeObserver above whenever a breakpoint flips the card's
  // display on/off) and skips the trig work entirely while the box has no area.
  const isVisible = () => (rectRef.current?.width ?? 0) > 0;
  const fallbackClock = useMotionValue(0);
  const clock = field?.elapsed ?? fallbackClock;
  const driftX = useTransform(clock, (t) =>
    engineActive && isVisible()
      ? organicWave(t, phase.x, driftSpeed) * driftRadius * motionScaleRef.current
      : 0
  );
  const driftY = useTransform(clock, (t) =>
    engineActive && isVisible()
      ? organicWave(t, phase.y, driftSpeed * 1.15) * driftRadius * 0.85 * motionScaleRef.current
      : 0
  );
  const driftRotateZ = useTransform(clock, (t) =>
    engineActive && isVisible()
      ? organicWave(t, phase.z, driftSpeed * 0.8) * MAX_DRIFT_TILT * motionScaleRef.current
      : 0
  );
  const driftRotateX = useTransform(clock, (t) =>
    engineActive && isVisible()
      ? organicWave(t, rxPhase.x, driftSpeed * 1.3) * MAX_MICRO_TILT * depth * motionScaleRef.current
      : 0
  );
  const driftRotateY = useTransform(clock, (t) =>
    engineActive && isVisible()
      ? organicWave(t, ryPhase.y, driftSpeed * 1.5) * MAX_MICRO_TILT * depth * motionScaleRef.current
      : 0
  );

  const finalX = useTransform([springX, driftX], ([s, d]) => (s as number) + (d as number));
  const finalY = useTransform([springY, driftY], ([s, d]) => (s as number) + (d as number));
  const finalRotateZ = useTransform(
    [springRotateZ, driftRotateZ],
    ([s, d]) => (s as number) + (d as number)
  );

  // Widgets with a tabletClassName own their position/size entirely through Tailwind's
  // md:/xl: variants (a hand-authored literal string — see FloatingObjectConfig), since
  // inline style would otherwise always outrank those classes. Widgets without one keep
  // the original single-breakpoint inline-style behaviour, unchanged.
  //
  // These branches must stay literal strings (not `` `${visibleFrom}:block` ``) — Tailwind's
  // scanner only generates CSS for class names it can find verbatim in source text, and a
  // runtime-concatenated token like that never appears anywhere as literal text.
  const hasTabletLayout = Boolean(tabletClassName);
  const visibilityClassName = !hideOnMobile
    ? "block"
    : hasTabletLayout
      ? `hidden ${tabletClassName}`
      : visibleFrom === "md"
        ? "hidden md:block"
        : visibleFrom === "lg"
          ? "hidden lg:block"
          : "hidden xl:block";

  return (
    <motion.div
      ref={homeRef}
      aria-hidden="true"
      data-hero-card={id}
      className={`pointer-events-none absolute ${visibilityClassName}`}
      style={
        hasTabletLayout
          ? undefined
          : {
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              right: position.right,
              width,
              height,
            }
      }
      initial={entranceActive ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        entranceActive
          ? { duration: 0.6, delay: entranceDelay, ease: EASE_SIGNATURE }
          : { duration: 0 }
      }
    >
      <motion.div
        className="h-full w-full"
        style={
          engineActive
            ? {
                x: finalX,
                y: finalY,
                rotateX: driftRotateX,
                rotateY: driftRotateY,
                rotateZ: finalRotateZ,
                transformPerspective: 800,
              }
            : undefined
        }
      >
        <motion.div
          data-cursor="view"
          className={`pointer-events-auto h-full w-full rounded-2xl border ${tierStyle.border} ${tierStyle.surface} ${tierStyle.shadow}`}
          whileHover={{
            scale: hoverScale,
            y: -4 * depth,
            boxShadow: tierStyle.hoverShadow,
          }}
          transition={SPRING_TRANSITION}
        >
          <FloatingCardContent id={id} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
