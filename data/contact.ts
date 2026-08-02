import type { ContactContent } from "@/types/contact";

// TODO: replace primaryCta.href with the real Calendly link.
// TODO: replace secondaryCta.href / any mailto links with the real email address.
export const contactContent: ContactContent = {
  headline: "Let's build something memorable.",
  description:
    "Whether it's consulting, AI products, startups, storytelling, or simply exchanging ideas—I always enjoy working with people obsessed with building meaningful things.",
  primaryCta: {
    label: "Let's Talk",
    href: "https://calendly.com/sambhav-jain",
  },
  secondaryCta: {
    label: "Email Me",
    href: "mailto:hello@sambhavjain.com",
  },
  availability: {
    title: "Currently",
    items: [
      "President — Grandeur Consulting",
      "Building AI products",
      "Consulting & Strategy",
      "Open to exciting collaborations",
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
