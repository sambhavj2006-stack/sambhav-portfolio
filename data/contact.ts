import type { ContactContent } from "@/types/contact";

export const contactContent: ContactContent = {
  headline: "Let's build something memorable.",
  description:
    "Whether it's consulting, strategy, storytelling, or simply exchanging ideas—I always enjoy working with people obsessed with building meaningful things.",
  primaryCta: {
    label: "Email Me",
    href: "mailto:sambhavj2006@gmail.com",
  },
  secondaryCta: {
    label: "Connect on LinkedIn",
    href: "https://www.linkedin.com/in/sambhavjain157/",
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
    copyright: "© 2026 Sambhav Jain",
    tagline: "Turning meh into memorable.",
    builtWith: ["Next.js", "TypeScript", "Tailwind", "Motion"],
    credit: "Designed and engineered by Sambhav Jain.",
  },
};
