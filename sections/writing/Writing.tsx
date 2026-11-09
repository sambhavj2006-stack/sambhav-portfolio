"use client";

import { useRef } from "react";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { useWorldStop } from "@/components/world/useWorldStop";
import { writingStats } from "@/data/numbers";
import { LINKS } from "@/lib/links";

export default function Writing() {
  const ref = useRef<HTMLElement>(null);
  useWorldStop(ref, { night: 0.9, dusk: 0.3, veil: 0.3 });

  return (
    <section ref={ref} id="writing" className="world-surface relative px-5 py-32 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-14 text-center">
        <SectionHeading
          index="04"
          label="Signal"
          title="Building in public, one post at a time."
          description="I write about consulting, strategy and the process of building — as a LinkedIn creator and a Topmate mentor."
          align="center"
        />
        <Reveal delay={0.1} as="ul" className="grid w-full grid-cols-3 gap-4 sm:gap-10">
          {writingStats.map((stat) => (
            <li key={stat.id} className="flex flex-col items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-bone sm:text-5xl">
                {stat.value}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone/45 sm:text-[10px]">
                {stat.label}
              </span>
            </li>
          ))}
        </Reveal>
        <Reveal delay={0.2} className="flex flex-wrap justify-center gap-3">
          <Button href={LINKS.linkedin}>Read on LinkedIn</Button>
          <Button href={LINKS.topmate} variant="ghost" className="text-bone">
            Book a session on Topmate
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
