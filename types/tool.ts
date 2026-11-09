export type ToolStatus = "Live" | "Beta" | "In progress";

export type Tool = {
  id: string;
  name: string;
  /** one line, in the tool's own words where possible */
  tagline: string;
  /** 1-2 factual sentences on what it does and who it's for */
  description: string;
  href: string;
  status: ToolStatus;
  /** short facts shown as chips (stack, audience, notable technique) */
  tags: string[];
  /** a real screenshot of the tool, in public/tools */
  preview?: { src: string; alt: string };
};
