"use client";

import Image from "next/image";
import { motion } from "motion/react";
import OrgMark from "@/components/ui/OrgMark";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { SPRING_HOVER } from "@/lib/motion";
import type { Work } from "@/types/work";
import DuneArt from "./DuneArt";

/** One work in the Archive grid. A link only when the work has somewhere to go. */
export default function WorkCard({ work }: { work: Work }) {
  const reduced = useSettledReducedMotion();
  const Tag = work.href ? motion.a : motion.article;
  const linkProps = work.href
    ? { href: work.href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className="grain group flex h-full flex-col overflow-hidden rounded-2xl border border-bone/12 bg-night/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye"
      whileHover={reduced ? undefined : { y: -6 }}
      whileTap={reduced || !work.href ? undefined : { scale: 0.98 }}
      transition={SPRING_HOVER}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {work.cover ? (
          <Image src={work.cover.src} alt={work.cover.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <DuneArt
            id={work.id}
            className="h-full w-full transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span className="text-ochre">{work.kind}</span>
          <span className="text-bone/40">{work.when}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold leading-snug text-bone transition-colors duration-500 group-hover:text-sand">
              {work.title}
              {work.href && (
                <span aria-hidden="true" className="ml-2 inline-block text-bone/40 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              )}
            </h3>
            {work.subtitle && <p className="text-sm text-bone/55">{work.subtitle}</p>}
          </div>
          {work.org && <OrgMark name={work.org} />}
        </div>
      </div>
    </Tag>
  );
}
