type InfoCardProps = {
  title: string;
  subtitle?: string;
  range: string;
  className?: string;
};

/**
 * Shared card shape for grid content (Builds, Awards) — same border/surface/shadow
 * language as AvailabilityCard, so new sections read as part of the existing system
 * rather than a new visual style.
 */
export default function InfoCard({
  title,
  subtitle,
  range,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`flex h-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-neutral-50 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-8px_rgba(0,0,0,0.09)] ${className}`}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        {range}
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
      </div>
    </div>
  );
}
