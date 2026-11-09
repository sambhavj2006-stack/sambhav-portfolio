"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import OrgMark from "@/components/ui/OrgMark";
import { useWorldStop } from "@/components/world/useWorldStop";
import { awards } from "@/data/awards";
import { certifications } from "@/data/certifications";

/**
 * Markers left in the sand: one row per result, the result itself set large. Rows with a
 * real photo reveal it on hover/press, floating at the row's right edge.
 */
export default function Awards() {
  const ref = useRef<HTMLElement>(null);
  useWorldStop(ref, { night: 0.78, dusk: 0.55, veil: 0.42 });

  return (
    <section ref={ref} id="awards" className="world-surface relative px-5 pb-32 pt-24 sm:px-8 md:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <SectionHeading
          index="03"
          label="Markers"
          title="Recognition along the way."
          description="National case competitions, strategy challenges and simulations."
        />

        <ol>
          {awards.map((award, i) => (
            <Reveal key={award.id} as="li" delay={Math.min(i * 0.04, 0.2)}>
              <div className="group relative grid gap-3 border-b border-bone/10 py-7 transition-colors duration-500 hover:border-bone/30 active:border-bone/30 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] md:items-center md:gap-10">
                <span className="font-display text-xl font-bold uppercase tracking-tight text-bone transition-colors duration-500 group-hover:text-sand md:text-2xl">
                  {award.title}
                </span>
                <span className="text-sm leading-relaxed text-bone/55 md:text-base">
                  {award.subtitle}
                </span>
                <div className="flex items-center gap-4 md:justify-end">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
                    {award.range}
                  </span>
                  {award.markName && <OrgMark name={award.markName} />}
                </div>
                {award.photo && (
                  <div className="pointer-events-none absolute -top-6 right-24 hidden h-28 w-40 rotate-2 overflow-hidden rounded-xl border border-bone/20 opacity-0 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:opacity-100 group-active:opacity-100 md:block">
                    <Image src={award.photo.src} alt={award.photo.alt} fill sizes="160px" className="object-cover" />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="flex flex-col gap-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ochre">Certifications</span>
          <ul className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <li key={cert.id} className="rounded-full border border-bone/15 px-4 py-2 text-sm text-bone/70">
                {cert.title} <span className="text-bone/35">· {cert.issuer}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
