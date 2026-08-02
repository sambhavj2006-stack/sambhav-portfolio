export type ContactCta = {
  label: string;
  href: string;
};

export type ContactAvailability = {
  title: string;
  items: string[];
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
  secondaryCta: ContactCta;
  availability: ContactAvailability;
  footer: ContactFooter;
};
