import type { Stat } from "@/types/stat";

export const numbers: Stat[] = [
  { id: "followers", value: "9,056+", label: "LinkedIn followers" },
  { id: "impressions", value: "2M+", label: "LinkedIn impressions" },
  { id: "team", value: "42", label: "Member team led" },
  { id: "reports", value: "39", label: "Research reports" },
  { id: "engagements", value: "14", label: "Client engagements" },
  { id: "sponsorships", value: "₹5L", label: "Sponsorships raised" },
  { id: "growth", value: "170%", label: "Growth delivered" },
  { id: "students-mentored", value: "1,000+", label: "Students mentored" },
  { id: "learning-hours", value: "300+", label: "Learning hours" },
];

const stat = (id: string) => numbers.find((n) => n.id === id)!;

/** The Writing section's stats row — reuses the entries above so values never drift apart. */
export const writingStats: Stat[] = [
  stat("followers"),
  stat("impressions"),
  { id: "connections", value: "500+", label: "Connections" },
];
