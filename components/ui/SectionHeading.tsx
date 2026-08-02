type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === "center"
          ? "items-center text-center"
          : "items-start text-left"
      }`}
    >
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
        {heading}
      </h2>
      {description && (
        <p className="max-w-xl text-base text-zinc-500">{description}</p>
      )}
    </div>
  );
}
