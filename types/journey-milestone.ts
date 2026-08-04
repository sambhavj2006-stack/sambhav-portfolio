/** One step within an org's internal promotion history — oldest first. */
export type CareerProgressionStep = {
  id: string;
  range: string;
  title: string;
  /** what changed / grew at this step — only shown on hover/click */
  description?: string;
};

export type JourneyPhoto = {
  src: string;
  alt: string;
};

export type JourneyMilestone = {
  id: string;
  range: string;
  title: string;
  organization: string;
  description?: string;
  /** Internal promotion history at this org, oldest first — when present, the milestone
   *  renders as one Career Progression rail (current title + expandable steps) instead
   *  of a flat role. */
  progression?: CareerProgressionStep[];
  /** Optional contextual photo — used sparingly, only where a real photo strengthens the
   *  story (e.g. the Grandeur team, a consulting engagement in progress). */
  photo?: JourneyPhoto;
};
