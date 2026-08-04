import Reveal from "@/components/system/Reveal";
import OrgMark from "@/components/ui/OrgMark";
import { socialLinks } from "@/data/social-links";
import { shouldOpenInNewTab } from "@/lib/motion";

export default function SocialLinks() {
  return (
    <Reveal
      as="ul"
      className="flex flex-wrap items-center justify-center gap-6"
      delay={0.3}
    >
      {socialLinks.map((link) => {
        const newTab = shouldOpenInNewTab(link.href);
        return (
          <li key={link.label}>
            <a
              href={link.href}
              target={newTab ? "_blank" : undefined}
              rel={newTab ? "noopener noreferrer" : undefined}
              aria-label={
                newTab ? `${link.label} (opens in new tab)` : link.label
              }
              className="group -m-2 flex items-center gap-2 rounded-sm p-2 text-sm font-medium text-zinc-500 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-900 active:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
            >
              <OrgMark
                name={link.label}
                size="sm"
                className="transition-colors duration-200 group-hover:border-zinc-300"
              />
              {link.label}
            </a>
          </li>
        );
      })}
    </Reveal>
  );
}
