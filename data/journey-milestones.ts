import type { JourneyMilestone } from "@/types/journey-milestone";

// Order matches the source résumé exactly — do not re-sort by date.
export const journeyMilestones: JourneyMilestone[] = [
  {
    id: "ceew",
    range: "June 2026 — Present",
    title: "Summer Intern",
    organization: "Council on Energy, Environment and Water (CEEW)",
    description: "Sustainable Water Department",
  },
  {
    id: "grandeur",
    range: "October 2024 — Present",
    title: "President",
    organization: "Grandeur",
    description: "Consulting & Knowledge Cell, SSCBS",
    progression: [
      {
        id: "grandeur-junior-consultant",
        range: "Oct 2024 — May 2025",
        title: "Junior Consultant",
      },
      {
        id: "grandeur-coordinator",
        range: "May 2025 — May 2026",
        title: "Coordinator",
      },
      {
        id: "grandeur-president",
        range: "May 2026 — Present",
        title: "President",
        description: "Leading a 42-member team across all consulting and knowledge operations.",
      },
    ],
  },
  {
    id: "harbor-holt",
    range: "June 2026 — Present",
    title: "Consulting Director",
    organization: "Harbor & Holt",
  },
  {
    id: "krafton",
    range: "February 2026 — Present",
    title: "Project Lead",
    organization: "KRAFTON India",
    description: "Live Project",
  },
  {
    id: "honasa",
    range: "January 2026 — Present",
    title: "Project Lead",
    organization: "Honasa Consumer Ltd.",
    description: "Live Project",
  },
  {
    id: "karol-bagh-estates",
    range: "January 2026 — Present",
    title: "Business Manager",
    organization: "Karol Bagh Estates Pvt Ltd",
  },
  {
    id: "linkedin",
    range: "October 2024 — Present",
    title: "Content Creator",
    organization: "LinkedIn",
    description: "9,056+ followers · 2M+ impressions",
  },
  {
    id: "clarifyd",
    range: "July 2025 — Present",
    title: "Founder",
    organization: "Clarifyd",
  },
  {
    id: "topmate",
    range: "July 2025 — Present",
    title: "Mentor",
    organization: "Topmate",
  },
  {
    id: "true-value-solutions",
    range: "June 2025 — Present",
    title: "Founding Member",
    organization: "True Value Solutions",
    description: "Strategy",
  },
];
