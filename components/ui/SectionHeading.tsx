import Reveal from "@/components/system/Reveal";

/**
 * Every section opens the same way: a mono waypoint index, then a wide display title.
 * Display type is always uppercase Syncopate; body copy never is.
 */
export default function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
}: {
  /** e.g. "01" */
  index: string;
  /** e.g. "The Arsenal" */
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <Reveal blur className={`flex flex-col gap-5 ${centered ? "items-center text-center" : ""}`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ochre">
        {index} <span className="text-bone/30">/</span> {label}
      </span>
      <h2 className="max-w-4xl text-balance font-display text-[clamp(1.75rem,4.2vw,3.5rem)] font-bold uppercase leading-[1.02] tracking-tight text-bone">
        {title}
      </h2>
      {description && (
        <p className={`max-w-xl text-base leading-relaxed text-bone/60 ${centered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
