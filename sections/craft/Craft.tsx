"use client";

import { useRef } from "react";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import OrgMark from "@/components/ui/OrgMark";
import { useWorldStop } from "@/components/world/useWorldStop";
import { crafts } from "@/data/craft";

/**
 * What I do — four disciplines, each anchored to the real roles behind it. Leaving the
 * maw: as this arrives the worm dives back under and the world opens onto dusk dunes.
 */
export default function Craft() {
  const ref = useRef<HTMLElement>(null);
  useWorldStop(ref, { maw: 0, night: 0.5, dusk: 1, moons: 0.3, veil: 0.32 });

  return (
    <section ref={ref} id="craft" className="world-surface relative px-5 pb-32 pt-24 sm:px-8 md:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <SectionHeading index="02" label="The Craft" title="What I do." />
        <ol>
          {crafts.map((craft, i) => (
            <Reveal key={craft.id} as="li" delay={Math.min(i * 0.06, 0.2)}>
              <div className="group grid gap-4 border-t border-bone/10 py-10 transition-colors duration-500 hover:border-bone/35 md:grid-cols-[4rem_minmax(0,5fr)_minmax(0,6fr)] md:items-baseline md:gap-10 md:py-12">
                <span className="font-mono text-[11px] text-bone/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.75rem)] font-bold uppercase leading-[1.02] tracking-tight text-bone transition-colors duration-500 group-hover:text-sand">
                  {craft.title}
                </h3>
                <div className="flex flex-col gap-5">
                  <p className="text-base leading-relaxed text-bone/65 md:text-lg">{craft.line}</p>
                  <ul className="flex flex-wrap gap-2" aria-label="Organizations">
                    {craft.orgs.map((org) => (
                      <li key={org} className="flex items-center gap-2 rounded-full border border-bone/12 py-1 pl-1 pr-3">
                        <OrgMark name={org} size="sm" />
                        <span className="text-xs text-bone/60">{org}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
