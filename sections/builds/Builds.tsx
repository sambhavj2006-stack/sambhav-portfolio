import BackgroundGrid from "@/components/ui/BackgroundGrid";
import Reveal from "@/components/system/Reveal";
import ScrollStage from "@/components/system/ScrollStage";
import SectionHeading from "@/components/ui/SectionHeading";
import InfoCard from "@/components/ui/InfoCard";
import { projects } from "@/data/projects";

const STAGGER = 0.06;
const MAX_STAGGER_DELAY = 0.24;

export default function Builds() {
  return (
    <ScrollStage
      id="builds"
      className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32"
    >
      <BackgroundGrid className="opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-16">
        <Reveal blur>
          <SectionHeading
            eyebrow="Builds"
            heading="Work that shaped the thinking."
            description="Research, strategy, and storytelling projects, built end to end."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal
              key={project.id}
              delay={Math.min(index * STAGGER, MAX_STAGGER_DELAY)}
            >
              <InfoCard
                title={project.title}
                subtitle={project.subtitle}
                range={project.range}
                markName={project.markName}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </ScrollStage>
  );
}
