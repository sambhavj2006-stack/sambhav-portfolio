"use client";

import { useEffect, useRef, useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import NavProgress from "./NavProgress";

const SCROLL_THRESHOLD = 80;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScrolled = () => {
      frameRef.current = null;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(updateScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[padding,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        scrolled
          ? "border-zinc-200 bg-white py-3"
          : "border-transparent bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center px-6">
        <DesktopNav scrolled={scrolled} />
        <MobileNav scrolled={scrolled} />
      </div>
      <NavProgress />
    </header>
  );
}
