/**
 * "What I do" — four disciplines, each grounded in real current roles (résumé-sourced).
 * `orgs` names must match lib/org-logos.ts to show a real logo.
 */
export type Craft = {
  id: string;
  title: string;
  line: string;
  orgs: string[];
};

export const crafts: Craft[] = [
  {
    id: "consulting",
    title: "Consulting & Strategy",
    line: "Consulting Director at Harbor & Holt, and project lead on live projects with KRAFTON India and Honasa Consumer.",
    orgs: ["Harbor & Holt", "KRAFTON India", "Honasa Consumer Ltd."],
  },
  {
    id: "building",
    title: "Building Tools",
    line: "Products that remove friction I kept hitting myself: Slingr for outreach, Bunkwise for attendance. Founder of Clarifyd.",
    orgs: ["Clarifyd"],
  },
  {
    id: "storytelling",
    title: "Storytelling",
    line: "Writing about consulting, strategy and the process of building as a LinkedIn creator, and mentoring students on Topmate.",
    orgs: ["LinkedIn"],
  },
  {
    id: "leadership",
    title: "Leadership",
    line: "President of Grandeur, the Consulting & Knowledge Cell at SSCBS, leading a 42-member team.",
    orgs: ["Grandeur"],
  },
];
