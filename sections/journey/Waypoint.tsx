import OrgMark from "@/components/ui/OrgMark";
import type { JourneyMilestone } from "@/types/journey-milestone";

/**
 * One stop on the trek. Promotions within one org (progression) render as a single
 * waypoint with its steps listed, oldest first, current highlighted — growth inside one
 * role, not three unrelated jobs.
 */
export default function Waypoint({
  milestone,
  index,
  className = "",
}: {
  milestone: JourneyMilestone;
  index: number;
  className?: string;
}) {
  const { range, title, organization, description, progression } = milestone;
  const hasProgression = Boolean(progression?.length);

  return (
    <article
      className={`grain flex flex-col gap-5 rounded-2xl border border-bone/12 bg-night/55 p-6 backdrop-blur-[2px] ${className}`}
    >
      <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em]">
        <span className="text-ochre">{range}</span>
        <span className="text-bone/30">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex gap-4">
        <OrgMark name={organization} />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-lg font-semibold leading-snug text-bone">
            {hasProgression ? organization : title}
          </h3>
          <span className="text-sm text-bone/55">{hasProgression ? description : organization}</span>
        </div>
      </div>
      {!hasProgression && description && (
        <p className="text-sm leading-relaxed text-bone/50">{description}</p>
      )}
      {hasProgression && (
        <ol className="flex flex-col gap-2 border-l border-bone/15 pl-4">
          {progression!.map((step, i) => {
            const current = i === progression!.length - 1;
            return (
              <li key={step.id} className="relative flex flex-col gap-0.5">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[19px] top-1.5 h-1.5 w-1.5 rounded-full ${
                    current ? "bg-eye shadow-[0_0_8px_2px_rgba(95,180,232,0.5)]" : "bg-bone/30"
                  }`}
                />
                <span className={`text-sm ${current ? "font-medium text-bone" : "text-bone/50"}`}>
                  {step.title}
                  <span className="ml-2 font-mono text-[10px] tracking-[0.15em] text-bone/35">
                    {step.range}
                  </span>
                </span>
                {step.description && (
                  <span className="text-xs leading-relaxed text-bone/45">{step.description}</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}
