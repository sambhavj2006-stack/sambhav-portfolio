import Reveal from "@/components/system/Reveal";
import StatTile from "@/components/ui/StatTile";
import { numbers } from "@/data/numbers";

/** Impact numbers — the capstone of the Journey section, in the same rhythm as the rest. */
export default function JourneyNumbers() {
  return (
    <Reveal
      as="ul"
      className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-zinc-200 pt-12 sm:grid-cols-3 sm:pt-16 lg:grid-cols-5"
    >
      {numbers.map((stat) => (
        <li key={stat.id}>
          <StatTile value={stat.value} label={stat.label} />
        </li>
      ))}
    </Reveal>
  );
}
