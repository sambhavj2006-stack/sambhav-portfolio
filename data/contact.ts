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
    title: "Now",
    items: [
      { role: "President", organization: "Grandeur" },
      { role: "Consulting Director", organization: "Harbor & Holt" },
      { role: "Project Lead", organization: "KRAFTON India & Honasa" },
      { role: "Founder", organization: "Clarifyd" },
    ],
    openFor: ["Consulting", "Strategy", "Collaborations"],
    statusText: "Open for conversations",
  },
  footer: {
    copyright: "© 2026",
    tagline: "Turning meh into memorable.",
    builtWith: ["Next.js", "TypeScript", "Tailwind", "Motion"],
    credit: "Designed and engineered by",
  },
};
