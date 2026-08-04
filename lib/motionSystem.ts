/**
 * Sambhav OS — the single motion system every animated surface on the site reads from.
 * One easing curve, one family of springs, one drift model, one cursor-variant map.
 * Nothing outside this file should invent a new stiffness/damping pair, a new easing
 * curve, or a new cursor scale — extend the system here instead.
 *
 * `lib/motion.ts` re-exports everything below for backward compatibility; existing
 * imports of `@/lib/motion` keep working unchanged. New code should import from here.
 */

// ---------------------------------------------------------------------------
// Easing — one curve, used for every entrance/reveal on the site
// ---------------------------------------------------------------------------

export const EASE_SIGNATURE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/**
 * Plain-CSS Tailwind transitions can't reference the constant above (arbitrary values
 * must be static literal text for the compiler to pick up) — use the literal
 * `ease-[cubic-bezier(0.16,1,0.3,1)]` utility directly instead, matching this same curve.
 */

// ---------------------------------------------------------------------------
// Springs — every spring on the site is one of these seven, or `{ ...spring, mass }`
// derived from one (see FloatingCard's per-widget settle spring).
// ---------------------------------------------------------------------------

/** Hover elevation, cursor parallax. Damping ratio > 1: no bounce, no overshoot. */
export const SPRING_HOVER = { stiffness: 150, damping: 26, mass: 0.5 };
/** Magnetic pull toward the cursor — low mass so it tracks without lag, still overdamped. */
export const SPRING_MAGNETIC = { stiffness: 220, damping: 20, mass: 0.25 };
/** Heaviest spring in the system — large-scale motion (scroll progress) that should feel like real inertia. */
export const SPRING_INERTIA = { stiffness: 90, damping: 30, mass: 0.8 };
/** Slow, lazy follow for the ambient Hero cursor glow — deliberately the laziest spring in the system. */
export const SPRING_GLOW = { stiffness: 80, damping: 24, mass: 0.6 };
/** The cursor ring's own spring — snappier than everything else, since it has to visibly keep up with the pointer. */
export const SPRING_CURSOR_RING = { stiffness: 260, damping: 24, mass: 0.3 };
/** The cursor dot's own spring — the snappiest spring in the system. */
export const SPRING_CURSOR_DOT = { stiffness: 420, damping: 28, mass: 0.15 };
/** Small tactile controls (nav avatar, status indicators) — a little livelier settle than SPRING_HOVER. */
export const SPRING_TACTILE = { stiffness: 300, damping: 18, mass: 0.35 };

// Back-compat aliases — previous names, unchanged behaviour, so every existing import
// of these from "@/lib/motion" keeps resolving to exactly the same spring object.
export const SPRING_TRANSITION = SPRING_HOVER;
export const MAGNETIC_SPRING = SPRING_MAGNETIC;
export const INERTIA_SPRING = SPRING_INERTIA;
export const GLOW_SPRING = SPRING_GLOW;
export const CURSOR_RING_SPRING = SPRING_CURSOR_RING;
export const CURSOR_DOT_SPRING = SPRING_CURSOR_DOT;

// ---------------------------------------------------------------------------
// Reveal
// ---------------------------------------------------------------------------

/** Shared viewport threshold every scroll-reveal in the system fires against, so sections wake up in lockstep. */
export const REVEAL_VIEWPORT = { once: true, margin: "-80px" } as const;

// ---------------------------------------------------------------------------
// Procedural drift — the floating proof cards' idle motion. Amplitude stays in this
// range (2-6px) across every tier so drift always reads as a held breath, never a
// bounce; each widget's own driftRadius (data/hero-floating-objects.ts) sits inside it.
// ---------------------------------------------------------------------------

export const DRIFT_AMPLITUDE = { min: 2, max: 6 } as const;

// ---------------------------------------------------------------------------
// Cursor variants — what the instrument (ring + dot) and the coordinate readout do for
// each kind of surface the pointer crosses. Add a case here, not a one-off in a component.
// ---------------------------------------------------------------------------

export type CursorVariant =
  | "default"
  | "click"
  | "pull"
  | "view"
  | "nav"
  | "timeline"
  | "text";

/** Ring scale per variant — bigger for things you view, smaller for things you're about to trigger. */
export const CURSOR_RING_SCALE: Record<CursorVariant, number> = {
  default: 1,
  click: 1.5,
  pull: 0.55,
  view: 2.6,
  nav: 1.15,
  timeline: 0.7,
  text: 0.8,
};

/** Dot scale per variant — hidden whenever the ring itself already reads as the affordance. */
export const CURSOR_DOT_SCALE: Record<CursorVariant, number> = {
  default: 1,
  click: 0,
  pull: 1,
  view: 0,
  nav: 1,
  timeline: 1,
  text: 0,
};

/**
 * The Hero coordinate readout's opacity per variant — 0 over anything readable or
 * interactive, so it never sits on top of a headline, a chip, or a button. It only shows
 * itself on genuinely empty canvas, and even then stays a quiet 0.5, not a full 1.
 */
export const CROSSHAIR_OPACITY: Record<CursorVariant, number> = {
  default: 0.5,
  click: 0,
  pull: 0,
  view: 0,
  nav: 0,
  timeline: 0,
  text: 0,
};

// ---------------------------------------------------------------------------
// Link helpers
// ---------------------------------------------------------------------------

export function isExternalLink(href: string) {
  return href.startsWith("http");
}

/** Links that should open in a new tab: external URLs and in-app files viewed inline (e.g. the résumé PDF). */
export function shouldOpenInNewTab(href: string) {
  return isExternalLink(href) || href.endsWith(".pdf");
}
