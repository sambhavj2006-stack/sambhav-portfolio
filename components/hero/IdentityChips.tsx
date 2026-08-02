const IDENTITY = ["Builder", "Consultant", "President", "Creator"];

export default function IdentityChips() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-3">
      {IDENTITY.map((item) => (
        <li
          key={item}
          className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
