import Image from "next/image";
import { getInitials } from "@/lib/text";
import { getOrgLogo } from "@/lib/org-logos";

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

const IMAGE_SIZES: Record<NonNullable<OrgMarkProps["size"]>, string> = {
  md: "36px",
  sm: "24px",
};

/**
 * A small, consistent badge standing in for an organization's mark. Where a real, official
 * logo file exists (public/photos/logos, matched in lib/org-logos.ts) it's used directly —
 * scaled to fit, never stretched. Everywhere else falls back to the generated monogram: an
 * imperfect copy from memory risks exactly the low-quality, inconsistent look a premium
 * site should avoid, so unmatched orgs get the clean vector fallback instead of a guess.
 */
export default function OrgMark({ name, size = "md", className = "" }: OrgMarkProps) {
  const logo = getOrgLogo(name);

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white font-semibold tracking-wide text-zinc-500 ${SIZE_STYLES[size]} ${className}`}
    >
      {logo ? (
        <Image
          src={logo.src}
          alt=""
          fill
          sizes={IMAGE_SIZES[size]}
          className="object-contain p-1.5"
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
