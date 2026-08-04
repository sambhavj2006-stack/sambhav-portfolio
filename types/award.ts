export type Award = {
  id: string;
  title: string;
  subtitle?: string;
  range: string;
  /** hosting organization/institution, for the card's monogram mark */
  markName?: string;
  /** optional contextual photo, revealed on hover — used sparingly */
  photo?: {
    src: string;
    alt: string;
  };
};
