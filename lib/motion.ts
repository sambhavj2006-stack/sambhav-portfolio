/** Shared easing curve for every entrance/reveal animation on the site (Motion components). */
export const EASE_SIGNATURE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Plain-CSS Tailwind transitions can't reference this constant (arbitrary values must be static
 * literal text for the compiler to pick up) — use the literal `ease-[cubic-bezier(0.16,1,0.3,1)]`
 * utility directly instead, matching this same curve.
 */

/** Shared, overdamped spring used for hover elevation and cursor parallax. Damping ratio > 1: no bounce, no overshoot. */
export const SPRING_TRANSITION = { stiffness: 150, damping: 26, mass: 0.5 };

/** Lighter, faster-settling spring for magnetic pull — still overdamped, but low mass so it tracks the cursor without lag. */
export const MAGNETIC_SPRING = { stiffness: 220, damping: 20, mass: 0.25 };

/** Heaviest spring in the system — used for large-scale motion (scroll progress) that should feel like it has real inertia. */
export const INERTIA_SPRING = { stiffness: 90, damping: 30, mass: 0.8 };

/** Shared viewport threshold every scroll-reveal in the system fires against, so sections wake up in lockstep. */
export const REVEAL_VIEWPORT = { once: true, margin: "-80px" } as const;

export function isExternalLink(href: string) {
  return href.startsWith("http");
}
