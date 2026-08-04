export type EducationEntry = {
  id: string;
  institution: string;
  program: string;
  range: string;
  detail?: string;
  photo?: {
    src: string;
    alt: string;
  };
};
