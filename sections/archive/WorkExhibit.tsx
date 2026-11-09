"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE, SPRING_HOVER } from "@/lib/motion";
import type { Work } from "@/types/work";
import DuneArt from "./DuneArt";

/**
 * A featured work, presented like an exhibit: a framed preview on one side, the facts on
 * the other (sides alternate). The whole row is the link; hover lifts the frame and
 * slowly pushes into the image, tap gives the same press.
 */
export default function WorkExhibit({ work, index }: { work: Work; index: number }) {
  const reduced = useSettledReducedMotion();
  const flip = index % 2 === 1;
  const Tag = work.href ? motion.a : motion.div;
  const linkProps = work.href
    ? {
        href: work.href,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `${work.title} — ${work.subtitle ?? work.kind} (opens in new tab)`,
      }
    : {};

  return (
    <Tag
      {...linkProps}
      className="group grid items-center gap-8 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye lg:grid-cols-12 lg:gap-14"
      initial={reduced ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.1, ease: EASE_SIGNATURE }}
      whileTap={reduced || !work.href ? undefined : { scale: 0.985 }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-2xl border border-bone/15 bg-night shadow-[0_40px_120px_-40px_rgba(95,180,232,0.25)] lg:col-span-7 ${
          flip ? "lg:order-2" : ""
        }`}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={SPRING_HOVER}
      >
        {work.href && (
          <div className="flex items-center gap-1.5 border-b border-bone/10 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-bone/20" />
            <span className="h-2 w-2 rounded-full bg-bone/20" />
            <span className="h-2 w-2 rounded-full bg-bone/20" />
            <span className="ml-3 truncate font-mono text-[10px] tracking-[0.15em] text-bone/40">
              {work.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </span>
          </div>
        )}
        <div className="relative aspect-[16/10] overflow-hidden">
          {work.cover ? (
            <Image
              src={work.cover.src}
              alt={work.cover.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-top transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <DuneArt id={work.id} className="h-full w-full" />
          )}
        </div>
      </motion.div>

      <div className={`flex flex-col gap-5 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.28em]">
          <span className="text-bone/35">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-bone/50">{work.kind}</span>
          {work.status && (
            <span className="flex items-center gap-2 rounded-full border border-bone/15 px-3 py-1 text-bone/70">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  work.status === "Live" ? "bg-eye shadow-[0_0_10px_2px_rgba(95,180,232,0.6)]" : "bg-ochre"
                }`}
              />
              {work.status}
            </span>
          )}
        </div>
        <h3 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-bold uppercase leading-none tracking-tight text-bone">
          {work.title}
        </h3>
        {work.subtitle && <p className="text-lg text-sand">{work.subtitle}</p>}
        {work.description && <p className="leading-relaxed text-bone/60">{work.description}</p>}
        {work.tags && (
          <ul className="flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-bone/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/50"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        {work.href && (
          <span className="mt-2 inline-flex w-fit items-center gap-3 border-b border-bone/30 pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-bone transition-colors duration-300 group-hover:border-eye group-hover:text-eye">
            Open {work.title}
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
            >
              ↗
            </span>
          </span>
        )}
      </div>
    </Tag>
  );
}
