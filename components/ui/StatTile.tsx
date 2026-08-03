type StatTileProps = {
  value: string;
  label: string;
  className?: string;
};

/** Shared number/label pair — used by Journey's impact numbers and the Writing stats row. */
export default function StatTile({ value, label, className = "" }: StatTileProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        {value}
      </span>
      <span className="text-xs text-zinc-500 sm:text-sm">{label}</span>
    </div>
  );
}
