export type FloatingObjectPosition = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export type FloatingObjectAnimation = {
  /** 0-1, controls hover lift/shadow intensity, and how strongly this widget answers the cursor (near layers respond more) */
  depth: number;
  /** 0-1, scales the ambient wide-field parallax against the global max */
  parallaxStrength: number;
  /** seconds, entrance stagger delay */
  entranceDelay: number;
  /** hover scale factor, e.g. 1.03 */
  hoverScale: number;
  /** relative weight fed into the settle spring's mass — heavier widgets drift less and return home more slowly */
  mass: number;
  /** px, radius of the continuous idle drift around the widget's home position */
  driftRadius: number;
  /** seconds, base cycle length of the procedural drift (longer = slower, heavier-feeling) */
  driftSpeed: number;
};

export type FloatingObjectConfig = {
  id: string;
  /** desktop (≥1280px / xl) position — the approved, unchanged layout */
  position: FloatingObjectPosition;
  /** desktop (≥1280px / xl) width */
  width: string;
  /** desktop (≥1280px / xl) height */
  height: string;
  hideOnMobile?: boolean;
  /** Tailwind breakpoint the card reappears at when hideOnMobile is true. Defaults to "xl" (true desktop). */
  visibleFrom?: "md" | "lg" | "xl";
  /**
   * Hand-authored literal Tailwind classes (md:/xl: prefixed position + size) for widgets
   * that get a distinct, larger tablet treatment instead of just disappearing until xl.
   * Must be a complete literal string (not built from `position`/`width`/`height` at
   * runtime) so Tailwind's static scanner can see and generate it.
   */
  tabletClassName?: string;
  /** 1 = primary proof, higher numbers recede (border/shadow/surface weight) */
  tier: 1 | 2 | 3 | 4 | 5;
  animation: FloatingObjectAnimation;
};
