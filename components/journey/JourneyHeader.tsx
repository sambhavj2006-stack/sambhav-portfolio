import Reveal from "@/components/system/Reveal";

export default function JourneyHeader() {
  return (
    <Reveal className="flex flex-col gap-4">
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        Journey
      </span>
      <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
        A career built on momentum.
      </h2>
    </Reveal>
  );
}
