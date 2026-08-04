export default function FloatingCardContent({ id }: { id: string }) {
  switch (id) {
    case "projects":
      return (
        <div className="flex h-full w-full flex-col justify-between p-3.5">
          <span className="w-fit rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-500">
            Live Project
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-zinc-900">
              KRAFTON India
            </span>
            <span className="text-xs text-zinc-500">Project Lead</span>
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 p-4">
          <span className="text-[10px] font-medium tracking-wide text-zinc-500">
            May 2026 → Present
          </span>
          <span className="text-sm font-semibold text-zinc-900">
            President
          </span>
          <span className="text-xs text-zinc-500">Grandeur, SSCBS</span>
        </div>
      );
    case "metrics":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="text-2xl font-semibold tracking-tight text-zinc-900">
            9K+
          </span>
          <span className="text-xs text-zinc-500">LinkedIn Followers</span>
        </div>
      );
    default:
      return null;
  }
}
