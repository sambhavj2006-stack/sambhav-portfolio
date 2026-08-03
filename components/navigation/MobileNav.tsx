"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navLinks } from "@/data/nav-links";
import { useSettledReducedMotion } from "@/components/system/useSettledReducedMotion";
import { EASE_SIGNATURE } from "@/lib/motion";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2";

export default function MobileNav({ scrolled }: { scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useSettledReducedMotion();

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="flex w-full items-center justify-between md:hidden">
      <NavLogo scrolled={scrolled} />
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-hidden={isOpen}
        tabIndex={isOpen ? -1 : 0}
        onClick={() => setIsOpen(true)}
        className={`-mr-2.5 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-sm opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-60 ${FOCUS_RING}`}
      >
        <span className="h-px w-5 bg-zinc-900" />
        <span className="h-px w-5 bg-zinc-900" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-8 bg-white"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: EASE_SIGNATURE }}
          >
            <motion.button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={close}
              className={`absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-sm text-2xl leading-none text-zinc-900 opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-60 ${FOCUS_RING}`}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05, ease: EASE_SIGNATURE }}
            >
              &times;
            </motion.button>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: EASE_SIGNATURE }}
            >
              <NavLinks
                items={navLinks}
                variant="column"
                linkClassName="text-lg px-4 py-2.5"
                onLinkClick={close}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
