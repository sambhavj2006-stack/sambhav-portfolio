"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navLinks } from "@/data/nav-links";
import { LINKS } from "@/lib/links";
import { EASE_SIGNATURE } from "@/lib/motion";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";

const LINK =
  "font-mono text-[11px] uppercase tracking-[0.22em] transition-opacity duration-300 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eye rounded-sm";

/**
 * Fixed top bar. The bar itself uses `mix-blend-difference` with white type, so one
 * colour stays legible over the bright day sky, the dark maw and the night alike —
 * no scroll listener, no colour swapping. The mobile menu lives outside the blended
 * layer (blending would invert it too).
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduced = useSettledReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button, a")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = dialog.querySelectorAll<HTMLElement>("a[href], button");
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="pointer-events-auto mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 text-bone sm:px-8">
          <a href="#top" className={`${LINK} font-display text-xs font-bold tracking-[0.3em]`}>
            Sambhav Jain
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={LINK}>
                {link.label}
              </a>
            ))}
            <a
              href={LINKS.resume}
              target="_blank"
              rel="noopener noreferrer"
              className={`${LINK} rounded-full border border-bone/40 px-4 py-2 hover:border-bone`}
            >
              Résumé
            </a>
          </nav>
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={`${LINK} -mr-2 p-2 md:hidden`}
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="grain fixed inset-0 z-60 flex flex-col bg-night px-5 py-5 text-bone"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE_SIGNATURE }}
          >
            <div className="flex justify-end">
              <button type="button" onClick={close} className={`${LINK} -mr-2 p-2`}>
                Close
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-[12vh] flex flex-col gap-6">
              {[...navLinks, { label: "Résumé", href: LINKS.resume }].map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  target={link.href.endsWith(".pdf") ? "_blank" : undefined}
                  className="font-display text-3xl font-bold uppercase tracking-tight"
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: EASE_SIGNATURE }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
