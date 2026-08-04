export type ContactCta = {
  label: string;
  href: string;
};

export type CurrentFocusItem = {
  role: string;
  organization: string;
};

export type ContactAvailability = {
  title: string;
  items: CurrentFocusItem[];
  openFor: string[];
  statusText: string;
};

export type ContactFooter = {
  copyright: string;
  tagline: string;
  builtWith: string[];
  credit: string;
};

export type ContactContent = {
  headline: string;
  description: string;
  primaryCta: ContactCta;
  collabCta: ContactCta;
  secondaryCta: ContactCta;
  availability: ContactAvailability;
  footer: ContactFooter;
};
