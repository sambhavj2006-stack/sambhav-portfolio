"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE, SPRING_HOVER } from "@/lib/motion";
import type { Tool } from "@/types/tool";

/**
 * One tool, presented like an exhibit: a framed live screenshot on one side, the facts
 * on the other (sides alternate). The whole row is the link — hover lifts the frame and
 * slowly pushes into the screenshot; tap on touch gives the same press.
 */
export default function ToolFeature({ tool, index }: { tool: Tool; index: number }) {
  const reduced = useSettledReducedMotion();
  const flip = index % 2 === 1;

  return (
    <motion.a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${tool.name} — ${tool.tagline} (opens in new tab)`}
      className="group grid items-center gap-8 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye lg:grid-cols-12 lg:gap-14"
      initial={reduced ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.1, ease: EASE_SIGNATURE }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-2xl border border-bone/15 bg-night shadow-[0_40px_120px_-40px_rgba(95,180,232,0.25)] lg:col-span-7 ${
          flip ? "lg:order-2" : ""
        }`}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={SPRING_HOVER}
      >
        <div className="flex items-center gap-1.5 border-b border-bone/10 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-bone/20" />
          <span className="h-2 w-2 rounded-full bg-bone/20" />
          <span className="h-2 w-2 rounded-full bg-bone/20" />
          <span className="ml-3 truncate font-mono text-[10px] tracking-[0.15em] text-bone/40">
            {tool.href.replace(/^https?:\/\/(www\.)?/, "")}
          </span>
        </div>
        {tool.preview && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={tool.preview.src}
              alt={tool.preview.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-top transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </div>
        )}
      </motion.div>

      <div className={`flex flex-col gap-5 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.28em]">
          <span className="text-bone/35">{String(index + 1).padStart(2, "0")}</span>
          <span className="flex items-center gap-2 rounded-full border border-bone/15 px-3 py-1 text-bone/70">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                tool.status === "Live" ? "bg-eye shadow-[0_0_10px_2px_rgba(95,180,232,0.6)]" : "bg-ochre"
              }`}
            />
            {tool.status}
          </span>
        </div>
        <h3 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-bold uppercase leading-none tracking-tight text-bone">
          {tool.name}
        </h3>
        <p className="text-lg text-sand">{tool.tagline}</p>
        <p className="leading-relaxed text-bone/60">{tool.description}</p>
        <ul className="flex flex-wrap gap-2">
          {tool.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-bone/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/50"
            >
              {tag}
            </li>
          ))}
        </ul>
        <span className="mt-2 inline-flex w-fit items-center gap-3 border-b border-bone/30 pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-bone transition-colors duration-300 group-hover:border-eye group-hover:text-eye">
          Open {tool.name}
          <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </span>
      </div>
    </motion.a>
  );
}
