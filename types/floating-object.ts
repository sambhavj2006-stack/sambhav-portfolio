export type FloatingObjectPosition = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export type FloatingObjectAnimation = {
  /** 0-1, controls hover lift/shadow intensity */
  depth: number;
  /** 0-1, scales cursor-driven translate/tilt against the global max */
  parallaxStrength: number;
  /** seconds, entrance stagger delay */
  entranceDelay: number;
  /** hover scale factor, e.g. 1.03 */
  hoverScale: number;
  /** px, amplitude of the continuous idle float */
  floatAmplitude: number;
  /** seconds, duration of one idle float cycle */
  floatDuration: number;
  /** seconds, phase offset so cards don't float in sync */
  floatDelay: number;
};

export type FloatingObjectConfig = {
  id: string;
  position: FloatingObjectPosition;
  width: string;
  height: string;
  hideOnMobile?: boolean;
  /** Tailwind breakpoint the card reappears at when hideOnMobile is true. Defaults to "md". */
  visibleFrom?: "md" | "lg";
  /** 1 = primary proof, higher numbers recede (border/shadow/surface weight) */
  tier: 1 | 2 | 3 | 4 | 5;
  animation: FloatingObjectAnimation;
};
