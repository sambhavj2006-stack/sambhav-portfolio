export type WorkKind = "Tool" | "Research" | "Strategy" | "Content";

export type Work = {
  id: string;
  title: string;
  kind: WorkKind;
  /** shown as-is, e.g. "2026" or "Feb 2026 — Apr 2026" */
  when: string;
  /** one line under the title */
  subtitle?: string;
  /** 1-2 factual sentences (featured works show this in full) */
  description?: string;
  /** where the card leads — a live tool, a PDF, a post. Omit and the card isn't a link. */
  href?: string;
  /** for tools */
  status?: "Live" | "Beta" | "In progress";
  tags?: string[];
  /** organization behind it, for the monogram/logo mark */
  org?: string;
  /** a real image in public/ — without one, the card gets generated desert art */
  cover?: { src: string; alt: string };
  /** featured works are shown as large exhibits above the grid */
  featured?: boolean;
};
