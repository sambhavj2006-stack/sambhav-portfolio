"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type BackgroundGridProps = {
  /** px between grid lines/intersections */
  cellSize?: number;
  className?: string;
};

const CURSOR_RADIUS = 160;
const DECAY = 0.95;
const IDLE_TIMEOUT = 400;
const MAX_DPR = 2;
const LINE_COLOR = "rgba(0,0,0,0.035)";
const MAX_DOT_ALPHA = 0.22;

/**
 * A faint canvas grid that sits behind Hero content. Nearby intersections brighten
 * on cursor proximity and fade back out, like an idle engineering surface.
 * Self-contained: no shared context, safe to reuse behind any relatively-positioned section.
 */
export default function BackgroundGrid({
  cellSize = 56,
  className = "",
}: BackgroundGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const interactive = !prefersReducedMotion && !isCoarsePointer;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let points = new Float32Array(0);
    let activation = new Float32Array(0);

    let mouseX = -Infinity;
    let mouseY = -Infinity;
    let lastMoveAt = 0;
    let rafId: number | null = null;
    let inView = true;

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

      const idle = now - lastMoveAt > IDLE_TIMEOUT && maxActivation < 0.01;
      if (!idle) rafId = requestAnimationFrame(frame);
    }

    function ensureLoop() {
      if (interactive && inView && rafId === null) {
        rafId = requestAnimationFrame(frame);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
      lastMoveAt = performance.now();
      ensureLoop();
    }

    function handlePointerLeave() {
      mouseX = -Infinity;
      mouseY = -Infinity;
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

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [cellSize, prefersReducedMotion]);

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
