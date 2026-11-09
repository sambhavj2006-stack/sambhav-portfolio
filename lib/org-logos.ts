export type OrgLogo = {
  src: string;
  alt: string;
};

/**
 * Official logos in public/photos/logos. Only orgs with a real, supplied mark are listed;
 * anything else falls back to OrgMark's generated monogram rather than a guessed logo.
 */
const LOGOS: Record<string, OrgLogo> = {
  Grandeur: { src: "/photos/logos/grandeur-logo.png", alt: "Grandeur" },
  "Harbor & Holt": { src: "/photos/logos/harbor-logo.jpg", alt: "Harbor & Holt" },
  "KRAFTON India": { src: "/photos/logos/krafton-logo.png", alt: "KRAFTON" },
  "Honasa Consumer Ltd.": { src: "/photos/logos/honasa-logo.webp", alt: "Honasa" },
  LinkedIn: { src: "/photos/logos/linkedin-logo.jpg", alt: "LinkedIn" },
  Clarifyd: { src: "/photos/logos/clarifyd-logo.jpg", alt: "Clarifyd" },
};

export function getOrgLogo(name: string): OrgLogo | null {
  return LOGOS[name] ?? null;
}
