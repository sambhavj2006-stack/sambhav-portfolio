import { getInitials } from "@/lib/text";

type OrgMarkProps = {
  name: string;
  /** "md" (36px, cards) or "sm" (24px, inline rows) */
  size?: "md" | "sm";
  className?: string;
};

const SIZE_STYLES: Record<NonNullable<OrgMarkProps["size"]>, string> = {
  md: "h-9 w-9 text-[11px]",
  sm: "h-6 w-6 text-[9px]",
};

/**
 * A small, consistent monogram badge standing in for an organization's mark. Real brand
 * logos aren't reproduced here — an imperfect copy from memory risks exactly the
 * low-quality, inconsistent look a premium site should avoid — so every organization
 * gets the same clean, on-brand vector treatment instead: one visual language, not a
 * patchwork of real and fabricated logos.
 */
export default function OrgMark({ name, size = "md", className = "" }: OrgMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white font-semibold tracking-wide text-zinc-500 ${SIZE_STYLES[size]} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
