import BackgroundGrid from "@/components/ui/BackgroundGrid";
import JourneyHeader from "./JourneyHeader";
import JourneyTimeline from "./JourneyTimeline";

export default function JourneySection() {
  return (
    <section
      id="journey"
      className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32"
    >
      <BackgroundGrid className="opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-16">
        <JourneyHeader />
        <JourneyTimeline />
      </div>
    </section>
  );
}
