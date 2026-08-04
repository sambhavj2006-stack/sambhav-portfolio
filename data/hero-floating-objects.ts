import type { FloatingObjectConfig } from "@/types/floating-object";

export const heroFloatingObjects: FloatingObjectConfig[] = [
  {
    id: "projects",
    position: { top: "8%", left: "6%" },
    width: "12.5rem",
    height: "7.5rem",
    hideOnMobile: true,
    // Tablet (md, 768-1023) gets its own larger, deliberately-placed treatment instead
    // of a scaled-down desktop layout; lg: restores the approved desktop numbers — laptop
    // and true desktop now share the same 5-card layout, differentiated only by motion
    // amplitude (see FloatingCard's motionScaleForWidth), not by which cards show.
    // top/height kept small even at md so a short landscape-tablet viewport (e.g. 1024x768)
    // still clears the headline — verified against the required breakpoint matrix. Height
    // matched to the timeline/writing cards' proportions (~1.6-1.9 aspect), not the taller
    // near-square shape this card used to have.
    tabletClassName:
      "md:block md:top-[6%] md:left-[5%] md:w-[13.5rem] md:h-[6.5rem] lg:top-[8%] lg:left-[6%] lg:w-[12.5rem] lg:h-[7.5rem]",
    tier: 1,
    animation: {
      depth: 1,
      parallaxStrength: 1,
      entranceDelay: 0.1,
      hoverScale: 1.03,
      mass: 1,
      driftRadius: 8,
      driftSpeed: 34,
    },
  },
  {
    id: "timeline",
    position: { top: "10%", right: "9%" },
    width: "10rem",
    height: "6rem",
    hideOnMobile: true,
    visibleFrom: "lg",
    tier: 2,
    animation: {
      depth: 0.65,
      parallaxStrength: 0.7,
      entranceDelay: 0.2,
      hoverScale: 1.04,
      mass: 0.8,
      driftRadius: 11,
      driftSpeed: 28,
    },
  },
  {
    id: "metrics",
    position: { bottom: "12%", left: "18%" },
    width: "8rem",
    height: "8rem",
    hideOnMobile: true,
    tabletClassName:
      "md:block md:bottom-[10%] md:right-[6%] md:left-auto md:w-[9.5rem] md:h-[9.5rem] lg:bottom-[12%] lg:left-[18%] lg:right-auto lg:w-[8rem] lg:h-[8rem]",
    tier: 3,
    animation: {
      depth: 0.5,
      parallaxStrength: 0.6,
      entranceDelay: 0.3,
      hoverScale: 1.05,
      mass: 0.65,
      driftRadius: 14,
      driftSpeed: 24,
    },
  },
  {
    id: "ai-builds",
    position: { bottom: "9%", right: "-1.5rem" },
    width: "14rem",
    height: "8rem",
    hideOnMobile: true,
    visibleFrom: "lg",
    tier: 4,
    animation: {
      depth: 0.85,
      parallaxStrength: 0.85,
      entranceDelay: 0.15,
      hoverScale: 1.03,
      mass: 0.9,
      driftRadius: 9,
      driftSpeed: 30,
    },
  },
  {
    id: "writing",
    position: { top: "38%", right: "3%" },
    width: "8rem",
    height: "5rem",
    hideOnMobile: true,
    visibleFrom: "lg",
    tier: 5,
    animation: {
      depth: 0.4,
      parallaxStrength: 0.5,
      entranceDelay: 0.35,
      hoverScale: 1.06,
      mass: 0.5,
      driftRadius: 18,
      driftSpeed: 20,
    },
  },
];
