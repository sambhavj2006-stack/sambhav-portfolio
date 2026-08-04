import Image from "next/image";
import Reveal from "@/components/system/Reveal";
import OrgMark from "@/components/ui/OrgMark";
import { educationEntries } from "@/data/education";
import { volunteerEntries } from "@/data/volunteering";

/** Education and volunteering — secondary to the main experience timeline, same rhythm. */
export default function JourneyFoundations() {
  return (
    <Reveal className="grid grid-cols-1 gap-10 border-t border-zinc-200 pt-12 sm:pt-16 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-6">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          Education
        </span>
        <ul className="flex flex-col gap-5">
          {educationEntries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3">
              <div className="flex gap-3">
                <OrgMark name={entry.institution} className="mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-zinc-900">
                    {entry.institution}
                  </span>
                  <span className="text-sm text-zinc-600">{entry.program}</span>
                  <span className="text-xs text-zinc-500">
                    {entry.range}
                    {entry.detail ? ` · ${entry.detail}` : ""}
                  </span>
                </div>
              </div>
              {entry.photo && (
                <Image
                  src={entry.photo.src}
                  alt={entry.photo.alt}
                  width={72}
                  height={72}
                  loading="lazy"
                  className="hidden h-16 w-16 shrink-0 rounded-lg border border-zinc-200 object-cover shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-8px_rgba(0,0,0,0.09)] sm:block"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-6">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          Volunteering
        </span>
        <ul className="flex flex-col gap-5">
          {volunteerEntries.map((entry) => (
            <li key={entry.id} className="flex gap-3">
              <OrgMark name={entry.organization} className="mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-zinc-900">
                  {entry.organization}
                </span>
                <span className="text-sm text-zinc-600">{entry.role}</span>
                {entry.range && (
                  <span className="text-xs text-zinc-500">{entry.range}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
