import { navLinks } from "@/data/nav-links";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";

export default function DesktopNav({ scrolled }: { scrolled: boolean }) {
  const mainLinks = navLinks.slice(0, -1);
  const contactLink = navLinks[navLinks.length - 1];

  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <NavLogo scrolled={scrolled} />
      <div className="flex items-center">
        <NavLinks items={mainLinks} variant="row" />
        <span aria-hidden="true" className="mx-6 h-4 w-px bg-zinc-200" />
        <a
          href={contactLink.href}
          className="rounded-sm text-sm font-medium text-zinc-900 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-600 active:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
        >
          {contactLink.label}
        </a>
      </div>
    </div>
  );
}
