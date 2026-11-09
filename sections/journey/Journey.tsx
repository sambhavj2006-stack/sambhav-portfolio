"use client";

import { useRef } from "react";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import OrgMark from "@/components/ui/OrgMark";
import { useWorldStop } from "@/components/world/useWorldStop";
import { educationEntries } from "@/data/education";
import { volunteerEntries } from "@/data/volunteering";
import { numbers } from "@/data/numbers";
import Trek from "./Trek";

/**
 * Leaving the maw: as this section arrives the throat closes back down and the world
 * opens onto dunes at dusk — the trek across them is the career so far.
 */
export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  useWorldStop(ref, { maw: 0, night: 0.5, dusk: 1, moons: 0.3, veil: 0.32 });

  return (
    <section ref={ref} id="journey" className="world-surface relative px-5 pb-32 pt-24 sm:px-8 md:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-20">
        <SectionHeading
          index="02"
          label="The Trek"
          title="A career built on momentum."
          description="Consulting, research, leadership and building — mostly at the same time."
        />
        <Trek />

        <Reveal className="grid gap-12 border-t border-bone/10 pt-14 lg:grid-cols-2">
          {[
            {
              label: "Education",
              items: educationEntries.map((e) => ({
                id: e.id,
                org: e.institution,
                line: e.program,
                meta: e.detail ? `${e.range} · ${e.detail}` : e.range,
              })),
            },
            {
              label: "Volunteering",
              items: volunteerEntries.map((v) => ({
                id: v.id,
                org: v.organization,
                line: v.role,
                meta: v.range,
              })),
            },
          ].map((group) => (
            <div key={group.label} className="flex flex-col gap-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ochre">
                {group.label}
              </span>
              <ul className="flex flex-col gap-5">
                {group.items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <OrgMark name={item.org} />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-bone">{item.org}</span>
                      <span className="text-sm text-bone/60">{item.line}</span>
                      {item.meta && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/40">
                          {item.meta}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <Reveal as="ul" className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-bone/10 pt-14 sm:grid-cols-3 lg:grid-cols-5">
          {numbers.map((stat) => (
            <li key={stat.id} className="flex flex-col gap-2">
              <span className="font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/45">
                {stat.label}
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
