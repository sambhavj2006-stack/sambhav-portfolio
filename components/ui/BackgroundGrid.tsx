"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useSurfaceField } from "@/components/system/useSurfaceField";
import { organicWave } from "@/lib/noise";
import { SPRING_GLOW } from "@/lib/motionSystem";

type BackgroundGridProps = {
  /** px between grid lines/intersections */
  cellSize?: number;
  className?: string;
  /** whether a click/tap sends a ripple propagating across the grid */
  ripple?: boolean;
};

const CURSOR_RADIUS = 160;
const DECAY = 0.95;
const IDLE_TIMEOUT = 400;
const MAX_DPR = 2;
const LINE_COLOR = "rgba(0,0,0,0.035)";
const MAX_DOT_ALPHA = 0.22;

const RIPPLE_SPEED = 0.6; // px/ms
const RIPPLE_LIFE = 900; // ms
const RIPPLE_BAND = 48; // px, width of the traveling ring
const RIPPLE_INTENSITY = 0.85;

const INK_LIFE = 500; // ms
const INK_MIN_SPACING = 8; // px, only add a new ink point once the cursor has moved this far
const INK_MAX_POINTS = 20;

type Ripple = { x: number; y: number; start: number };
type InkPoint = { x: number; y: number; start: number };

/**
 * Grid density adapts to viewport width — the same cell size that reads as a refined
 * drafting texture on desktop becomes visual clutter on a phone. Widening the cells
 * (not the line weight/opacity) keeps the "engineering surface" language intact while
 * halving-ish the intersection count on small screens.
 */
function densityScaleForWidth(viewportWidth: number) {
  if (viewportWidth < 480) return 1.6;
  if (viewportWidth < 768) return 1.35;
  return 1;
}

/**
 * Sambhav OS surface field: a faint canvas grid that sits behind section content.
 * Nearby intersections brighten on cursor proximity, and a click sends a ripple
 * propagating outward across the intersections — the shared "engineering desk"
 * texture every section is drawn on. Self-contained: safe to mount behind any
 * relatively-positioned section, reads the shared pointer field for cursor position.
 */
export default function BackgroundGrid({
  cellSize = 56,
  className = "",
  ripple = true,
}: BackgroundGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const field = useSurfaceField();

  // Ambient life at rest: a barely-there opacity breath (one very slow layered sine, ~45s
  // period) and a whisper of cursor parallax (spring-lazy, ≤3px). Both are pure CSS
  // composited properties on a wrapper above the canvas, never touching the imperative
  // drawing loop below — so this costs nothing extra even while that loop is idle.
  const fallback = useMotionValue(0);
  const animateAmbient = Boolean(field) && !field!.prefersReducedMotion && !field!.isCoarsePointer;
  const breathOpacity = useTransform(field?.elapsed ?? fallback, (t) =>
    animateAmbient ? 0.96 + organicWave(t, 0.6, 46) * 0.04 : 1
  );
  const rawParallaxX = useTransform(field?.nx ?? fallback, (v) => (animateAmbient ? v * 3 : 0));
  const rawParallaxY = useTransform(field?.ny ?? fallback, (v) => (animateAmbient ? v * 3 : 0));
  const parallaxX = useSpring(rawParallaxX, SPRING_GLOW);
  const parallaxY = useSpring(rawParallaxY, SPRING_GLOW);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    const interactive = Boolean(field) && !field!.prefersReducedMotion && !field!.isCoarsePointer;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let effectiveCellSize = cellSize;
    let points = new Float32Array(0);
    let activation = new Float32Array(0);
    let ripples: Ripple[] = [];
    let ink: InkPoint[] = [];
    let lastInkX = -Infinity;
    let lastInkY = -Infinity;

    let lastMoveAt = 0;
    let rafId: number | null = null;
    let inView = true;
    let containerRect = container.getBoundingClientRect();

    function drawGridLines() {
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = Math.round(c * effectiveCellSize) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = 0; r <= rows; r++) {
        const y = Math.round(r * effectiveCellSize) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }

    function drawStaticFrame() {
      ctx.clearRect(0, 0, width, height);
      drawGridLines();
    }

    function buildGrid() {
      const rect = container!.getBoundingClientRect();
      containerRect = rect;
      width = rect.width;
      height = rect.height;
      effectiveCellSize = cellSize * densityScaleForWidth(window.innerWidth);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / effectiveCellSize);
      rows = Math.ceil(height / effectiveCellSize);
      const count = (cols + 1) * (rows + 1);
      points = new Float32Array(count * 2);
      activation = new Float32Array(count);
      let i = 0;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          points[i * 2] = c * effectiveCellSize;
          points[i * 2 + 1] = r * effectiveCellSize;
          i++;
        }
      }

      drawStaticFrame();
    }

    function frame(now: number) {
      rafId = null;
      if (!inView) return;

      containerRect = container!.getBoundingClientRect();
      const mouseX = field ? field.x.get() - containerRect.left : -Infinity;
      const mouseY = field ? field.y.get() - containerRect.top : -Infinity;
      const speed = field ? field.speed.get() : 0;
      if (speed > 0.02) lastMoveAt = now;

      if (ripples.length) {
        ripples = ripples.filter((r) => now - r.start <= RIPPLE_LIFE);
      }

      // Procedural ink: a short trail of the cursor's actual (un-snapped) path, distinct
      // from the grid's snapped-dot proximity glow — only recorded while really moving.
      if (
        speed > 0.05 &&
        mouseX > -Infinity &&
        mouseX >= 0 &&
        mouseX <= width &&
        mouseY >= 0 &&
        mouseY <= height
      ) {
        const dxInk = mouseX - lastInkX;
        const dyInk = mouseY - lastInkY;
        if (Math.sqrt(dxInk * dxInk + dyInk * dyInk) >= INK_MIN_SPACING) {
          ink.push({ x: mouseX, y: mouseY, start: now });
          if (ink.length > INK_MAX_POINTS) ink.shift();
          lastInkX = mouseX;
          lastInkY = mouseY;
        }
      }
      if (ink.length) {
        ink = ink.filter((point) => now - point.start <= INK_LIFE);
      }

      ctx!.clearRect(0, 0, width, height);
      drawGridLines();

      for (const point of ink) {
        const age = (now - point.start) / INK_LIFE;
        const alpha = (1 - age) * 0.14;
        const radius = 2.75 - age * 2;
        if (alpha <= 0.004 || radius <= 0) continue;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        ctx!.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      let maxActivation = 0;
      const n = activation.length;
      for (let i = 0; i < n; i++) {
        const px = points[i * 2];
        const py = points[i * 2 + 1];
        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_RADIUS) {
          const proximity = 1 - dist / CURSOR_RADIUS;
          if (proximity > activation[i]) activation[i] = proximity;
        }

        for (const r of ripples) {
          const elapsed = now - r.start;
          const ringRadius = elapsed * RIPPLE_SPEED;
          const rdx = px - r.x;
          const rdy = py - r.y;
          const pointDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const distFromRing = Math.abs(pointDist - ringRadius);
          if (distFromRing < RIPPLE_BAND / 2) {
            const boost =
              RIPPLE_INTENSITY *
              (1 - elapsed / RIPPLE_LIFE) *
              (1 - distFromRing / (RIPPLE_BAND / 2));
            if (boost > activation[i]) activation[i] = boost;
          }
        }

        const a = activation[i] * DECAY;
        activation[i] = a;

        if (a > 0.01) {
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(0,0,0,${(a * MAX_DOT_ALPHA).toFixed(3)})`;
          ctx!.arc(px, py, 1.25 + a * 1.75, 0, Math.PI * 2);
          ctx!.fill();
        }
        if (a > maxActivation) maxActivation = a;
      }

      const idle =
        now - lastMoveAt > IDLE_TIMEOUT &&
        maxActivation < 0.01 &&
        ripples.length === 0 &&
        ink.length === 0;
      if (!idle) rafId = requestAnimationFrame(frame);
    }

    function ensureLoop() {
      if (interactive && inView && rafId === null) {
        rafId = requestAnimationFrame(frame);
      }
    }

    const resizeObserver = new ResizeObserver(() => buildGrid());
    resizeObserver.observe(container);
    buildGrid();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) ensureLoop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    let unsubscribeSpeed: (() => void) | undefined;
    let unsubscribePresence: (() => void) | undefined;
    const handlePointerDown = (event: PointerEvent) => {
      if (!ripple) return;
      const rect = container!.getBoundingClientRect();
      containerRect = rect;
      ripples.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        start: performance.now(),
      });
      ensureLoop();
    };

    if (interactive && field) {
      unsubscribeSpeed = field.speed.on("change", (value) => {
        if (value > 0.02) ensureLoop();
      });
      unsubscribePresence = field.presence.on("change", (value) => {
        if (value > 0) ensureLoop();
      });
      window.addEventListener("pointerdown", handlePointerDown, { passive: true });
      ensureLoop();
    }

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointerdown", handlePointerDown);
      unsubscribeSpeed?.();
      unsubscribePresence?.();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [cellSize, ripple, field]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <motion.div
        className="h-full w-full"
        style={{ opacity: breathOpacity, x: parallaxX, y: parallaxY }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </motion.div>
    </div>
  );
}
