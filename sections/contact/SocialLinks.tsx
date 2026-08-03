import Reveal from "@/components/system/Reveal";
import { socialLinks } from "@/data/social-links";
import { isExternalLink } from "@/lib/motion";

export default function SocialLinks() {
  return (
    <Reveal
      as="ul"
      className="flex flex-wrap items-center justify-center gap-6"
      delay={0.3}
    >
      {socialLinks.map((link) => {
        const external = isExternalLink(link.href);
        return (
          <li key={link.label}>
            <a
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="rounded-sm text-sm font-medium text-zinc-500 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          </li>
        );
      })}
    </Reveal>
  );
}
