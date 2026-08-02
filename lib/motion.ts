/** Shared easing curve for every entrance/reveal animation on the site (Motion components). */
export const EASE_SIGNATURE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Plain-CSS Tailwind transitions can't reference this constant (arbitrary values must be static
 * literal text for the compiler to pick up) — use the literal `ease-[cubic-bezier(0.16,1,0.3,1)]`
 * utility directly instead, matching this same curve.
 */

/** Shared, overdamped spring used for hover elevation and cursor parallax. Damping ratio > 1: no bounce, no overshoot. */
export const SPRING_TRANSITION = { stiffness: 150, damping: 26, mass: 0.5 };

export function isExternalLink(href: string) {
  return href.startsWith("http");
}
