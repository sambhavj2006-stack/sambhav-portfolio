export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  range: string;
  /** associated organization, for the card's monogram mark — omit if there isn't one */
  markName?: string;
};
