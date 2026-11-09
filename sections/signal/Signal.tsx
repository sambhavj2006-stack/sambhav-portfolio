"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { useWorldStop } from "@/components/world/useWorldStop";
import { posts } from "@/data/posts";
import { LINKS } from "@/lib/links";

/**
 * Signal — LinkedIn and mentoring. Curated posts appear as cards once data/posts.ts has
 * entries; until then it's the invitation alone.
 */
export default function Signal() {
  const ref = useRef<HTMLElement>(null);
  useWorldStop(ref, { night: 0.85, dusk: 0.35, veil: 0.3 });

  return (
    <section ref={ref} id="signal" className="world-surface relative px-5 py-32 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <SectionHeading
          index="03"
          label="Signal"
          title="Building in public."
          description="I write on LinkedIn about consulting, strategy and the process of building — and mentor students one-on-one on Topmate."
        />

        {posts.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} as="li" delay={Math.min(i * 0.06, 0.2)}>
                <a
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grain group flex h-full flex-col overflow-hidden rounded-2xl border border-bone/12 bg-night/60 transition-colors duration-500 hover:border-bone/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye"
                >
                  {post.image && (
                    <div className="relative aspect-[16/10]">
                      <Image src={post.image.src} alt={post.image.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                    <p className="text-lg leading-snug text-bone">&ldquo;{post.hook}&rdquo;</p>
                    <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-bone/45">
                      {post.when}
                      <span className="text-bone/70 transition-colors duration-300 group-hover:text-eye">Read ↗</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        )}

        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <Button href={LINKS.linkedin}>Follow on LinkedIn</Button>
          <Button href={LINKS.topmate} variant="ghost" className="text-bone">
            Book a session on Topmate
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
