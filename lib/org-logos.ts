export type OrgLogo = {
  src: string;
  alt: string;
};

/**
 * Official logos, sourced from public/photos/logos — only orgs with a real, official mark
 * are listed here. Anything not listed (or not confidently matched) falls back to OrgMark's
 * generated monogram rather than risk a wrong/fabricated logo.
 */
const EXACT_MATCHES: Record<string, OrgLogo> = {
  Grandeur: { src: "/photos/logos/grandeur-logo.png", alt: "Grandeur" },
  "Council on Energy, Environment and Water (CEEW)": {
    src: "/photos/logos/ceew-logo.png",
    alt: "CEEW",
  },
  "Harbor & Holt": { src: "/photos/logos/harbor-logo.jpg", alt: "Harbor & Holt" },
  "KRAFTON India": { src: "/photos/logos/krafton-logo.png", alt: "KRAFTON" },
  "Honasa Consumer Ltd.": { src: "/photos/logos/honasa-logo.webp", alt: "Honasa" },
  LinkedIn: { src: "/photos/logos/linkedin-logo.jpg", alt: "LinkedIn" },
  Clarifyd: { src: "/photos/logos/clarifyd-logo.jpg", alt: "Clarifyd" },
  Topmate: { src: "/photos/logos/topmate-logo.png", alt: "Topmate" },
  GitHub: { src: "/photos/logos/github-logo.svg", alt: "GitHub" },
  "Shaheed Sukhdev College of Business Studies": {
    src: "/photos/logos/sscbs-logo.jpg",
    alt: "SSCBS",
  },
};

const SSCBS_LOGO: OrgLogo = { src: "/photos/logos/sscbs-logo.jpg", alt: "SSCBS" };

export function getOrgLogo(name: string): OrgLogo | null {
  if (EXACT_MATCHES[name]) return EXACT_MATCHES[name];
  if (name.includes("SSCBS")) return SSCBS_LOGO;
  return null;
}
