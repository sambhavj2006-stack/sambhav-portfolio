import BackgroundGrid from "@/components/ui/BackgroundGrid";
import Reveal from "@/components/system/Reveal";
import ScrollStage from "@/components/system/ScrollStage";
import SectionHeading from "@/components/ui/SectionHeading";
import StatTile from "@/components/ui/StatTile";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/system/Magnetic";
import { writingStats } from "@/data/numbers";
import { LINKS } from "@/lib/links";

export default function Writing() {
  return (
    <ScrollStage
      id="writing"
      className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32"
    >
      <BackgroundGrid className="opacity-60" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-12 text-center">
        <Reveal blur>
          <SectionHeading
            eyebrow="Writing"
            heading="Building in public, one post at a time."
            description="I write about consulting, strategy, and the process of building — as a LinkedIn Content Creator and a Topmate mentor."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-3 gap-4 sm:gap-8">
          {writingStats.map((stat) => (
            <StatTile
              key={stat.id}
              value={stat.value}
              label={stat.label}
              className="items-center text-center"
            />
          ))}
        </Reveal>

        <Reveal delay={0.2} className="flex flex-col items-center gap-4 sm:flex-row">
          <Magnetic>
            <Button href={LINKS.linkedin} variant="primary">
              Read on LinkedIn
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={LINKS.topmate} variant="secondary">
              Book a session on Topmate
            </Button>
          </Magnetic>
        </Reveal>
      </div>
    </ScrollStage>
  );
}
