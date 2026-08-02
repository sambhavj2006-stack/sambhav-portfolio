import { journeyMilestones } from "@/data/journey-milestones";
import JourneyMilestone from "./JourneyMilestone";

export default function JourneyTimeline() {
  return (
    <div className="border-b border-zinc-200">
      {journeyMilestones.map((milestone, index) => (
        <JourneyMilestone key={milestone.id} {...milestone} index={index} />
      ))}
    </div>
  );
}
