import Reveal from "@/components/system/Reveal";
import type { JourneyMilestone as JourneyMilestoneType } from "@/types/journey-milestone";

const STAGGER = 0.08;
const MAX_STAGGER_DELAY = 0.24;

export default function JourneyMilestone({
  range,
  title,
  organization,
  description,
  index,
}: JourneyMilestoneType & { index: number }) {
  return (
    <Reveal
      className="grid grid-cols-1 gap-3 border-t border-zinc-200 py-8 sm:py-10 lg:grid-cols-12 lg:gap-8"
      delay={Math.min(index * STAGGER, MAX_STAGGER_DELAY)}
    >
      <span className="text-sm text-zinc-500 lg:col-span-3">{range}</span>
      <div className="flex flex-col gap-1 lg:col-span-9">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <span className="text-sm font-medium text-zinc-600">
          {organization}
        </span>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">{description}</p>
      </div>
    </Reveal>
  );
}
