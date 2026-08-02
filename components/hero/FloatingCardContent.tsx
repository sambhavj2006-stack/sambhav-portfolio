export default function FloatingCardContent({ id }: { id: string }) {
  switch (id) {
    case "projects":
      return (
        <div className="flex h-full w-full flex-col justify-between p-4">
          <span className="w-fit rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-500">
            Live Project
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-zinc-900">
              Krafton India
            </span>
            <span className="text-xs text-zinc-500">Growth Strategy</span>
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 p-4">
          <span className="text-[10px] font-medium tracking-wide text-zinc-500">
            2023 → 2026
          </span>
          <span className="text-sm font-semibold text-zinc-900">
            President
          </span>
          <span className="text-xs text-zinc-500">Grandeur Consulting</span>
        </div>
      );
    case "metrics":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="text-2xl font-semibold tracking-tight text-zinc-900">
            8.7K+
          </span>
          <span className="text-xs text-zinc-500">LinkedIn Community</span>
        </div>
      );
    case "ai-builds":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-0.5 p-4">
          <span className="text-sm font-semibold text-zinc-900">
            AI Case Copilot
          </span>
          <span className="text-xs text-zinc-500">40+ Workflows</span>
        </div>
      );
    case "writing":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-0.5 p-4">
          <span className="text-xs text-zinc-500">Turning Meh into</span>
          <span className="text-sm font-semibold text-zinc-900">
            Memorable
          </span>
        </div>
      );
    default:
      return null;
  }
}
