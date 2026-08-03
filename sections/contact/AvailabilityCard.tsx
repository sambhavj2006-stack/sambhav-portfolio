import Reveal from "@/components/system/Reveal";
import { contactContent } from "@/data/contact";

export default function AvailabilityCard() {
  const { availability } = contactContent;

  return (
    <Reveal
      className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-neutral-50 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-8px_rgba(0,0,0,0.09)]"
      delay={0.2}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        {availability.title}
      </span>
      <ul className="mt-6 flex flex-col gap-3 text-left">
        {availability.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
            <span className="text-sm text-zinc-700">{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-center gap-2 border-t border-zinc-200 pt-6">
        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
        <span className="text-sm font-medium text-zinc-600">
          {availability.statusText}
        </span>
      </div>
    </Reveal>
  );
}
