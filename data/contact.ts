import type { ContactContent } from "@/types/contact";
import { LINKS } from "@/lib/links";

export const contactContent: ContactContent = {
  headline: "Let's build something memorable.",
  description:
    "Whether it's consulting, strategy, storytelling, or simply exchanging ideas—I always enjoy working with people obsessed with building meaningful things.",
  primaryCta: {
    label: "Email Me",
    href: LINKS.email,
  },
  collabCta: {
    label: "Let's Collaborate",
    href: LINKS.collab,
  },
  secondaryCta: {
    label: "Connect on LinkedIn",
    href: LINKS.linkedin,
  },
  availability: {
    title: "Currently",
    items: [
      "President — Grandeur, SSCBS",
      "Consulting Director — Harbor & Holt",
      "Project Lead — KRAFTON India & Honasa Consumer",
      "Founder — Clarifyd",
      "Open to consulting & strategy conversations",
    ],
    statusText: "Available for conversations.",
  },
  footer: {
    copyright: "© 2026",
    tagline: "Turning meh into memorable.",
    builtWith: ["Next.js", "TypeScript", "Tailwind", "Motion"],
    credit: "Designed and engineered by",
  },
};
