"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { journeyMilestones } from "@/data/journey-milestones";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import Reveal from "@/components/system/Reveal";
import Waypoint from "./Waypoint";

const WIDE_QUERY = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * The career as a walk across the dunes. On wide screens the section pins and vertical
 * scroll walks you sideways past each waypoint while footprints press into the sand
 * behind you. On narrow screens, or with reduced motion, it's an honest vertical list —
 * same waypoints, no scroll-jacking.
 */
export default function Trek() {
  const reduced = useSettledReducedMotion();
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false
  );

  if (!wide || reduced) {
    return (
      <ol className="grid gap-5 md:grid-cols-2">
        {journeyMilestones.map((m, i) => (
          <Reveal key={m.id} as="li" delay={Math.min((i % 2) * 0.08, 0.16)}>
            <Waypoint milestone={m} index={i} className="h-full" />
          </Reveal>
        ))}
      </ol>
    );
  }
  return <HorizontalTrek />;
}

function HorizontalTrek() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const trail = useTransform(scrollYProgress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);

  return (
    <div ref={outerRef} style={{ height: `calc(100svh + ${distance}px)` }} className="relative -mx-5 sm:-mx-8">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="relative flex w-max items-start gap-8 px-[8vw] pb-24">
          {journeyMilestones.map((m, i) => (
            <div key={m.id} className={`relative w-[24rem] shrink-0 ${i % 2 ? "mt-24" : ""}`}>
              <Waypoint milestone={m} index={i} />
            </div>
          ))}
          {/* footprints pressed into the sand, revealed as you walk */}
          <motion.svg
            aria-hidden="true"
            style={{ clipPath: trail }}
            className="pointer-events-none absolute bottom-6 left-0 h-10 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="steps" width="56" height="40" patternUnits="userSpaceOnUse">
                <ellipse cx="12" cy="12" rx="5" ry="2.6" fill="rgba(244,236,221,0.32)" transform="rotate(-8 12 12)" />
                <ellipse cx="40" cy="27" rx="5" ry="2.6" fill="rgba(244,236,221,0.32)" transform="rotate(-8 40 27)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#steps)" />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}
