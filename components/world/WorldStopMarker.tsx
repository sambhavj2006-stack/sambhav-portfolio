"use client";

import { useRef } from "react";
import type { WorldMood } from "@/lib/world";
import { useWorldStop } from "./useWorldStop";

/**
 * Lets a server-rendered section declare a world mood without becoming a client
 * component itself: drop this as the section's first child (it's an invisible,
 * zero-height marker at the section's top edge).
 */
export default function WorldStopMarker({ mood }: { mood: Partial<WorldMood> }) {
  const ref = useRef<HTMLDivElement>(null);
  useWorldStop(ref, mood);
  return <div ref={ref} aria-hidden="true" className="absolute inset-x-0 top-0 h-0" />;
}
