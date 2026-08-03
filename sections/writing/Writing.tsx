import BackgroundGrid from "@/components/ui/BackgroundGrid";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import StatTile from "@/components/ui/StatTile";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/system/Magnetic";
import { socialLinks } from "@/data/social-links";

const WRITING_STATS = [
  { id: "followers", value: "9,056+", label: "LinkedIn followers" },
  { id: "impressions", value: "2M+", label: "LinkedIn impressions" },
  { id: "connections", value: "500+", label: "Connections" },
];

const linkedinHref =
  socialLinks.find((link) => link.label === "LinkedIn")?.href ?? "#";
const topmateHref =
  socialLinks.find((link) => link.label === "Topmate")?.href ?? "#";

export default function Writing() {
  return (
    <section
      id="writing"
      className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32"
    >
      <BackgroundGrid className="opacity-60" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-12 text-center">
        <Reveal>
          <SectionHeading
            eyebrow="Writing"
            heading="Building in public, one post at a time."
            description="I write about consulting, strategy, and the process of building — as a LinkedIn Content Creator and a Topmate mentor."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-3 gap-8">
          {WRITING_STATS.map((stat) => (
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
            <Button href={linkedinHref} variant="primary">
              Read on LinkedIn
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={topmateHref} variant="secondary">
              Book a session on Topmate
            </Button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
