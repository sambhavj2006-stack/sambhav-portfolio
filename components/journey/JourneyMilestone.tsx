import Reveal from "@/components/system/Reveal";
import OrgMark from "@/components/ui/OrgMark";
import CareerProgression from "./CareerProgression";
import JourneyPhoto from "./JourneyPhoto";
import type { JourneyMilestone as JourneyMilestoneType } from "@/types/journey-milestone";

const STAGGER = 0.08;
const MAX_STAGGER_DELAY = 0.24;

export default function JourneyMilestone({
  range,
  title,
  organization,
  description,
  progression,
  photo,
  index,
}: JourneyMilestoneType & { index: number }) {
  return (
    <Reveal
      className="grid grid-cols-1 gap-3 border-t border-zinc-200 py-8 sm:py-10 lg:grid-cols-12 lg:gap-8"
      delay={Math.min(index * STAGGER, MAX_STAGGER_DELAY)}
    >
      <span className="text-sm text-zinc-500 lg:col-span-3">{range}</span>
      <div className="flex flex-col gap-5 lg:col-span-9 sm:flex-row sm:gap-6">
        <div className="flex flex-1 gap-4">
          <OrgMark name={organization} className="mt-0.5" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {progression && progression.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {organization}
                </h3>
                {description && (
                  <span className="text-sm font-medium text-zinc-600">
                    {description}
                  </span>
                )}
                <CareerProgression steps={progression} className="mt-3 max-w-md" />
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
                <span className="text-sm font-medium text-zinc-600">
                  {organization}
                </span>
                {description && (
                  <p className="mt-2 max-w-2xl text-sm text-zinc-500">{description}</p>
                )}
              </>
            )}
          </div>
        </div>
        {photo && <JourneyPhoto src={photo.src} alt={photo.alt} />}
      </div>
    </Reveal>
  );
}
