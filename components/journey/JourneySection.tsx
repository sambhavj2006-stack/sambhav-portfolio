import BackgroundGrid from "@/components/ui/BackgroundGrid";
import ScrollStage from "@/components/system/ScrollStage";
import JourneyHeader from "./JourneyHeader";
import JourneyTimeline from "./JourneyTimeline";
import JourneyFoundations from "./JourneyFoundations";
import JourneyNumbers from "./JourneyNumbers";

export default function JourneySection() {
  return (
    <ScrollStage
      id="journey"
      className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32"
    >
      <BackgroundGrid className="opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-16">
        <JourneyHeader />
        <JourneyTimeline />
        <JourneyFoundations />
        <JourneyNumbers />
      </div>
    </ScrollStage>
  );
}
