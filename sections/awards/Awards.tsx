import BackgroundGrid from "@/components/ui/BackgroundGrid";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import InfoCard from "@/components/ui/InfoCard";
import { awards } from "@/data/awards";
import { certifications } from "@/data/certifications";

const STAGGER = 0.05;
const MAX_STAGGER_DELAY = 0.24;

export default function Awards() {
  return (
    <section
      id="awards"
      className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32"
    >
      <BackgroundGrid className="opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Awards"
            heading="Recognition along the way."
            description="National case competitions, strategy challenges, and simulations."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, index) => (
            <Reveal
              key={award.id}
              delay={Math.min(index * STAGGER, MAX_STAGGER_DELAY)}
            >
              <InfoCard
                title={award.title}
                subtitle={award.subtitle}
                range={award.range}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-col gap-6 border-t border-zinc-200 pt-12 sm:pt-16">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Certifications
          </span>
          <ul className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <li
                key={cert.id}
                className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600"
              >
                {cert.title}{" "}
                <span className="text-zinc-400">· {cert.issuer}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
