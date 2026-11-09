import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import OrgMark from "@/components/ui/OrgMark";
import { tools } from "@/data/tools";
import { projects } from "@/data/projects";
import ToolFeature from "./ToolFeature";
import WorldStopMarker from "@/components/world/WorldStopMarker";

/**
 * Inside the maw: open night sky. The tools are the main event — the thing this site
 * gets sent around for — followed by a quieter index of research and strategy builds.
 * The world stays fully night here (the Descent already set that mood).
 */
export default function Tools() {
  return (
    <section id="tools" className="world-surface relative px-5 pb-32 pt-24 sm:px-8 md:pt-32">
      {/* fully inside the maw by now: arm its exit as a dive back into the sand */}
      <WorldStopMarker mood={{ sink: 1 }} />
      <div className="mx-auto flex max-w-7xl flex-col gap-24 md:gap-36">
        <SectionHeading
          index="01"
          label="The Arsenal"
          title="Tools I've built and shipped."
          description="Real products, in real use. Each one solves a problem I kept running into myself."
        />

        <div className="flex flex-col gap-28 md:gap-40">
          {tools.map((tool, i) => (
            <ToolFeature key={tool.id} tool={tool} index={i} />
          ))}
        </div>

        <div className="flex flex-col gap-10">
          <Reveal className="flex items-end justify-between gap-6 border-b border-bone/10 pb-6">
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-bone sm:text-xl">
              Research &amp; strategy builds
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone/40">
              {projects.length} works
            </span>
          </Reveal>
          <ol>
            {projects.map((project, i) => (
              <Reveal key={project.id} as="li" delay={Math.min(i * 0.05, 0.25)}>
                <div className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-bone/10 py-6 transition-colors duration-500 hover:border-bone/30 sm:grid-cols-[3rem_1fr_auto_auto] sm:items-center sm:gap-x-8">
                  <span className="font-mono text-[11px] text-bone/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-medium text-bone transition-colors duration-500 group-hover:text-sand sm:text-xl">
                      {project.title}
                    </span>
                    {project.subtitle && (
                      <span className="text-sm text-bone/50">{project.subtitle}</span>
                    )}
                  </div>
                  <span className="col-start-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40 sm:col-start-auto">
                    {project.range}
                  </span>
                  {project.markName ? (
                    <OrgMark name={project.markName} className="hidden sm:inline-flex" />
                  ) : (
                    <span className="hidden h-9 w-9 sm:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
