"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import WorldStopMarker from "@/components/world/WorldStopMarker";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";
import { works } from "@/data/works";
import type { WorkKind } from "@/types/work";
import WorkExhibit from "./WorkExhibit";
import WorkCard from "./WorkCard";

const featured = works.filter((w) => w.featured);
const rest = works.filter((w) => !w.featured);
const kinds = Array.from(new Set(rest.map((w) => w.kind)));

/**
 * The Archive — everything built, inside the maw's night sky. Featured works are large
 * exhibits; everything else sits in a grid, filterable by kind once there's more than one
 * kind to filter (the filter row hides itself until then).
 */
export default function Archive() {
  const [filter, setFilter] = useState<WorkKind | "All">("All");
  const reduced = useSettledReducedMotion();
  const shown = filter === "All" ? rest : rest.filter((w) => w.kind === filter);

  return (
    <section id="archive" className="world-surface relative px-5 pb-32 pt-24 sm:px-8 md:pt-32">
      {/* fully inside the maw by now: arm its exit as a dive back into the sand */}
      <WorldStopMarker mood={{ sink: 1 }} />
      <div className="mx-auto flex max-w-7xl flex-col gap-24 md:gap-36">
        <SectionHeading
          index="01"
          label="The Archive"
          title="Everything I've built."
          description="Tools in real use, research, strategy work and writing — all of it, in one place."
        />

        <div className="flex flex-col gap-28 md:gap-40">
          {featured.map((work, i) => (
            <WorkExhibit key={work.id} work={work} index={i} />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="flex flex-col gap-10">
            <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-bone/10 pb-6">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-bone sm:text-xl">
                More from the archive
              </h3>
              {kinds.length > 1 ? (
                <div role="group" aria-label="Filter by kind" className="flex flex-wrap gap-2">
                  {(["All", ...kinds] as const).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      aria-pressed={filter === kind}
                      onClick={() => setFilter(kind)}
                      className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye ${
                        filter === kind
                          ? "border-bone bg-bone text-night"
                          : "border-bone/20 text-bone/60 hover:border-bone/50 hover:text-bone"
                      }`}
                    >
                      {kind}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone/40">
                  {rest.length} works
                </span>
              )}
            </Reveal>

            <motion.ul layout={!reduced} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((work) => (
                  <motion.li
                    key={work.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: EASE_SIGNATURE }}
                  >
                    <WorkCard work={work} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        )}
      </div>
    </section>
  );
}
