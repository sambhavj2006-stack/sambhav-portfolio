"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/system/Reveal";
import Button from "@/components/ui/Button";
import { useWorldStop } from "@/components/world/useWorldStop";
import { contactContent } from "@/data/contact";
import { socialLinks } from "@/data/social-links";
import { shouldOpenInNewTab } from "@/lib/motion";

/**
 * Nightfall. The two moons rise large on the horizon as the trek ends; the invitation
 * sits under them.
 */
export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  useWorldStop(ref, { night: 1, dusk: 0.12, moons: 1, veil: 0.05 });
  const { availability } = contactContent;

  return (
    <section ref={ref} id="contact" className="world-surface relative px-5 pb-16 pt-32 sm:px-8 md:pt-44">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <Reveal blur className="flex flex-col gap-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ochre">
            04 <span className="text-bone/30">/</span> Nightfall
          </span>
          <h2 className="max-w-5xl font-display text-[clamp(2.2rem,7vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-bone">
            {contactContent.headline}
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-bone/60">{contactContent.description}</p>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <Button href={contactContent.primaryCta.href}>{contactContent.primaryCta.label}</Button>
          {contactContent.collabCta.href && (
            <Button href={contactContent.collabCta.href} variant="ghost" className="text-bone">
              {contactContent.collabCta.label}
            </Button>
          )}
          <Button href={contactContent.secondaryCta.href} variant="ghost" className="text-bone">
            {contactContent.secondaryCta.label}
          </Button>
        </Reveal>

        <Reveal delay={0.15} className="grid gap-8 border-t border-bone/10 pt-12 grid-cols-[auto_1fr] items-center">
          <div className="relative h-28 w-24 overflow-hidden rounded-xl border border-bone/15">
            <Image
              src="/photos/gallery/front-shot.jpeg"
              alt="Sambhav Jain"
              fill
              sizes="96px"
              className="object-cover object-top sepia-[0.25]"
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-ochre">
              <span className="h-1.5 w-1.5 rounded-full bg-eye shadow-[0_0_10px_2px_rgba(95,180,232,0.6)]" />
              {availability.statusText}
            </span>
            <ul className="flex flex-wrap gap-2">
              {availability.openFor.map((item) => (
                <li key={item} className="rounded-full border border-bone/15 px-3 py-1 text-sm text-bone/70">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <footer className="flex flex-col gap-6 border-t border-bone/10 pt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/45 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {socialLinks.map((link) => {
              const newTab = shouldOpenInNewTab(link.href);
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={newTab ? "_blank" : undefined}
                    rel={newTab ? "noopener noreferrer" : undefined}
                    className="transition-colors duration-300 hover:text-bone focus-visible:text-bone focus-visible:outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <span>
            {contactContent.footer.copyright} Sambhav Jain · {contactContent.footer.builtWith.join(" · ")}
          </span>
        </footer>
      </div>
    </section>
  );
}
