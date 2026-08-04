import type { SocialLink } from "@/types/social-link";
import { LINKS } from "@/lib/links";

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: LINKS.linkedin },
  { label: "GitHub", href: LINKS.github },
  { label: "Topmate", href: LINKS.topmate },
  { label: "Email", href: LINKS.email },
];
