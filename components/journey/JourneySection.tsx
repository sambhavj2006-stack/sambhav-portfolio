import JourneyHeader from "./JourneyHeader";
import JourneyTimeline from "./JourneyTimeline";

export default function JourneySection() {
  return (
    <section id="journey" className="w-full bg-white px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <JourneyHeader />
        <JourneyTimeline />
      </div>
    </section>
  );
}
