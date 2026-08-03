"use client";

import { useEffect, useRef } from "react";
import { useSurfaceField } from "@/components/system/useSurfaceField";

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

type Ripple = { x: number; y: number; start: number };

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
    let points = new Float32Array(0);
    let activation = new Float32Array(0);
    let ripples: Ripple[] = [];

    let lastMoveAt = 0;
    let rafId: number | null = null;
    let inView = true;
    let containerRect = container.getBoundingClientRect();

    function drawGridLines() {
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = Math.round(c * cellSize) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = 0; r <= rows; r++) {
        const y = Math.round(r * cellSize) + 0.5;
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
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      const count = (cols + 1) * (rows + 1);
      points = new Float32Array(count * 2);
      activation = new Float32Array(count);
      let i = 0;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          points[i * 2] = c * cellSize;
          points[i * 2 + 1] = r * cellSize;
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

      ctx!.clearRect(0, 0, width, height);
      drawGridLines();

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
        now - lastMoveAt > IDLE_TIMEOUT && maxActivation < 0.01 && ripples.length === 0;
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
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
