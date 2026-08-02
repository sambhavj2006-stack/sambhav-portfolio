"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/data/nav-links";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2";

export default function MobileNav({ scrolled }: { scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-sm opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-60 ${FOCUS_RING}`}
      >
        <span className="h-px w-5 bg-zinc-900" />
        <span className="h-px w-5 bg-zinc-900" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-8 bg-white"
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={close}
            className={`absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-sm text-2xl leading-none text-zinc-900 opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-60 ${FOCUS_RING}`}
          >
            &times;
          </button>
          <NavLinks
            items={navLinks}
            variant="column"
            linkClassName="text-lg"
            onLinkClick={close}
          />
        </div>
      )}
    </div>
  );
}
