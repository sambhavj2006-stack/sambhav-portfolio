import type { ReactNode } from "react";
import { LINKS } from "@/lib/links";

type AuthorLinkProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * Every mention of the name that represents professional identity (Hero, Footer, ...)
 * routes through here so it consistently opens LinkedIn with the same subtle hover
 * treatment, instead of each section wiring its own anchor.
 */
export default function AuthorLink({ className = "", children }: AuthorLinkProps) {
  return (
    <a
      href={LINKS.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Sambhav Jain on LinkedIn"
      className={`rounded-sm underline-offset-4 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${className}`}
    >
      {children ?? "Sambhav Jain"}
    </a>
  );
}
