import type { Award } from "@/types/award";

// Newest first, matching the source résumé.
export const awards: Award[] = [
  {
    id: "goer",
    title: "National Top 10",
    subtitle: "GOER Challenge · IRM India",
    range: "June 2026",
    markName: "IRM India",
  },
  {
    id: "brainwars",
    title: "National Top 20",
    subtitle: "BrAINWARS 2026 · Bain & Company",
    range: "May 2026",
    markName: "Bain & Company",
  },
  {
    id: "accenture-strategy-connect",
    title: "National Finalist",
    subtitle: "Accenture Strategy Connect Season 4 · Received PPI",
    range: "August 2025",
    markName: "Accenture",
  },
  {
    id: "multi-institution-finalist",
    title: "National Finalist",
    subtitle: "IIM Rohtak · IIM Kozhikode · Masters' Union · Gargi College · SRCC",
    range: "May 2025",
    markName: "IIM Rohtak",
    photo: {
      src: "/photos/awards/presentation.jpeg",
      alt: "Presenting the final round at Masters' Union",
    },
  },
  {
    id: "kirori-mal",
    title: "Runner Up",
    subtitle: "Kirori Mal College",
    range: "April 2025",
    markName: "Kirori Mal College",
  },
  {
    id: "iim-lucknow",
    title: "National Finalist",
    subtitle: "Bake the Strategy, Vridhi Season 3 · IIM Lucknow",
    range: "February 2025",
    markName: "IIM Lucknow",
  },
  {
    id: "hindu-college",
    title: "National Rank 2",
    subtitle: "Envisage · Hindu College",
    range: "February 2025",
    markName: "Hindu College",
    photo: {
      src: "/photos/awards/award.jpeg",
      alt: "Receiving the award on stage at Contrivance '25",
    },
  },
  {
    id: "mdi-gurgaon",
    title: "National Rank 3",
    subtitle: "ThinCovation · MDI Gurgaon",
    range: "December 2024",
    markName: "MDI Gurgaon",
  },
  {
    id: "iim-calcutta",
    title: "National Rank 6",
    subtitle: "What's the Logic · IIM Calcutta",
    range: "December 2024",
    markName: "IIM Calcutta",
  },
];
