/**
 * Back-compat entry point — the motion system now lives in `lib/motionSystem.ts`.
 * Kept as a thin re-export so existing `@/lib/motion` imports never break; new code
 * should import from `@/lib/motionSystem` directly.
 */
export * from "./motionSystem";
