import type { Tool } from "@/types/tool";

/**
 * Every tool Sambhav has built. Facts come from each tool's own site / README —
 * add a new entry here and it appears in the Tools section automatically.
 */
export const tools: Tool[] = [
  {
    id: "slingr",
    name: "Slingr",
    tagline: "Cold emails that sound like you. Follow-ups you won't forget.",
    description:
      "A Chrome side panel and dashboard for students doing internship, referral and networking outreach. It researches the person with you, drafts a personal first email in your voice, and reminds you when to follow up. It never sends email for you.",
    href: "https://www.slingr.in",
    status: "Beta",
    tags: ["Chrome extension", "Outreach", "For students"],
    preview: { src: "/tools/slingr.jpg", alt: "Slingr landing page" },
  },
  {
    id: "bunkwise",
    name: "Bunkwise",
    tagline: "Bunk wisely.",
    description:
      "Attendance register and waiver optimizer for SSCBS students. Upload the portal export and it finds the exact set of waiver dates that maximises attendance marks with the fewest society waivers. Everything runs in the browser; no attendance data leaves your device.",
    href: "https://bunkwisely.vercel.app",
    status: "Live",
    tags: ["Integer programming", "Runs in-browser", "SSCBS"],
    preview: {
      src: "/tools/bunkwise.jpg",
      alt: "Bunkwise's 3D intro of the SSCBS campus",
    },
  },
];
