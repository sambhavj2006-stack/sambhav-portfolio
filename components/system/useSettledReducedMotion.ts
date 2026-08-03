"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Same signal as motion's `useReducedMotion`, but never trusted until after mount.
 * `useReducedMotion` reads `window.matchMedia` synchronously on the client's very first
 * render (not from an effect), so when the OS setting is already on, the client's first
 * paint disagrees with the server's (which always assumes `false`) — a hydration
 * mismatch. `mounted` mirrors the same trick used elsewhere in this codebase
 * (`useSyncExternalStore` with a server snapshot of `false`): server and the client's
 * first paint stay identical, and the real value applies a frame later.
 */
export function useSettledReducedMotion(): boolean {
  const raw = Boolean(useReducedMotion());
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  return mounted && raw;
}
