"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";

const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const subscribe = () => () => {};

/**
 * The fixed desert behind the whole page. A painted CSS fallback sits underneath, so the
 * first paint is never blank and content never waits on WebGL; the canvas fades in over
 * it once the first frame is ready. Without WebGL, `no-webgl` on <html> gives reading
 * sections solid night surfaces instead (see globals.css).
 *
 * Reduced motion keeps the world but freezes time — a still painted frame that still
 * changes mood as you scroll, with no drifting sand or twinkling.
 */
export default function WorldBackdrop() {
  const reduced = useSettledReducedMotion();
  const [ready, setReady] = useState(false);
  const support = useSyncExternalStore(
    subscribe,
    () => (detectWebGL() ? "webgl" : "none"),
    () => "pending"
  );
  const lowPower = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768,
    () => false
  );

  useEffect(() => {
    if (support === "none") document.documentElement.classList.add("no-webgl");
  }, [support]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="world-fallback absolute inset-0" />
      {support === "webgl" && (
        <div
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <WorldScene frozen={reduced} lowPower={lowPower} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
