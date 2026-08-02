import type { FloatingObjectConfig } from "@/types/floating-object";

export const heroFloatingObjects: FloatingObjectConfig[] = [
  {
    id: "projects",
    label: "Projects",
    position: { top: "8%", left: "6%" },
    width: "15rem",
    height: "11rem",
  },
  {
    id: "timeline",
    label: "Timeline",
    position: { top: "10%", right: "9%" },
    width: "10rem",
    height: "6rem",
    hideOnMobile: true,
  },
  {
    id: "metrics",
    label: "Metrics",
    position: { bottom: "12%", left: "18%" },
    width: "8rem",
    height: "8rem",
    hideOnMobile: true,
  },
  {
    id: "ai-builds",
    label: "AI Builds",
    position: { bottom: "9%", right: "-2.5rem" },
    width: "14rem",
    height: "8rem",
  },
  {
    id: "writing",
    label: "Writing",
    position: { top: "38%", right: "3%" },
    width: "8rem",
    height: "5rem",
    hideOnMobile: true,
  },
];
