/**
 * Deep Desert — the one place every easing curve and spring on the site comes from.
 * Component code never invents its own stiffness/damping pair or cubic-bezier; it
 * imports one of these. (The WebGL world has its own damping in lib/world.ts.)
 */

/** The signature curve: long, soft settle. Every reveal and UI transition uses it. */
export const EASE_SIGNATURE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/**
 * Tailwind transitions can't reference the constant above — use the literal utility
 * `ease-[cubic-bezier(0.16,1,0.3,1)]` instead (same curve).
 */

/** Hover lift / press on cards and buttons. Overdamped: no bounce. */
export const SPRING_HOVER = { stiffness: 150, damping: 26, mass: 0.5 };

/** Scroll-linked motion (the career trek, progress rails) — heavy, like sand. */
export const SPRING_INERTIA = { stiffness: 90, damping: 30, mass: 0.8 };

/** Shared viewport threshold for every scroll reveal. */
export const REVEAL_VIEWPORT = { once: true, margin: "-80px" } as const;

export function isExternalLink(href: string) {
  return href.startsWith("http");
}

/** External URLs and in-app files viewed inline (e.g. the résumé PDF) open in a new tab. */
export function shouldOpenInNewTab(href: string) {
  return isExternalLink(href) || href.endsWith(".pdf");
}
