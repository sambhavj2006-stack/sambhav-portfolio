import type { Work } from "@/types/work";

/**
 * The Archive — everything Sambhav has built. Newest first within each group.
 * To add something: append an entry (a cover image in public/works/ is optional — without
 * one the card gets generated desert art). `featured: true` makes it a large exhibit.
 * Facts only: copy comes from the work itself (its site, README or document).
 */
export const works: Work[] = [
  {
    id: "slingr",
    title: "Slingr",
    kind: "Tool",
    when: "2026",
    featured: true,
    status: "Beta",
    subtitle: "Cold emails that sound like you. Follow-ups you won't forget.",
    description:
      "A Chrome side panel and dashboard for students doing internship, referral and networking outreach. It researches the person with you, drafts a personal first email in your voice, and reminds you when to follow up. It never sends email for you.",
    href: "https://www.slingr.in",
    tags: ["Chrome extension", "Outreach", "For students"],
    cover: { src: "/tools/slingr.jpg", alt: "Slingr landing page" },
  },
  {
    id: "bunkwise",
    title: "Bunkwise",
    kind: "Tool",
    when: "2026",
    featured: true,
    status: "Live",
    subtitle: "Bunk wisely.",
    description:
      "Attendance register and waiver optimizer for SSCBS students. Upload the portal export and it finds the exact set of waiver dates that maximises attendance marks with the fewest society waivers. Everything runs in the browser; no attendance data leaves your device.",
    href: "https://bunkwisely.vercel.app",
    tags: ["Integer programming", "Runs in-browser", "SSCBS"],
    cover: { src: "/tools/bunkwise.jpg", alt: "Bunkwise's 3D intro of the SSCBS campus" },
  },
  {
    id: "industry-primer-second-edition",
    title: "Grandeur Industry Primer",
    kind: "Research",
    when: "Feb 2026 — Apr 2026",
    subtitle: "Second Edition",
    org: "Grandeur",
  },
  {
    id: "industry-primer-first-edition",
    title: "Grandeur Industry Primer",
    kind: "Research",
    when: "Apr 2025 — Aug 2025",
    subtitle: "First Edition",
    org: "Grandeur",
  },
  {
    id: "beyond-color",
    title: "Beyond Color",
    kind: "Research",
    when: "May 2025 — Jul 2025",
    subtitle: "Unpacking Asian Paints",
  },
  {
    id: "dna-economy",
    title: "DNA Economy",
    kind: "Research",
    when: "Nov 2024 — Feb 2025",
    subtitle: "Biotechnology thesis",
  },
  {
    id: "edtech-thesis",
    title: "EdTech",
    kind: "Research",
    when: "Dec 2024 — Jan 2025",
    subtitle: "Thesis",
  },
];
