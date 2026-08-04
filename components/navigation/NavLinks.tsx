import type { NavLink } from "@/types/nav-link";

type NavLinksProps = {
  items: NavLink[];
  variant?: "row" | "column";
  linkClassName?: string;
  onLinkClick?: () => void;
};

export default function NavLinks({
  items,
  variant = "row",
  linkClassName = "text-sm",
  onLinkClick,
}: NavLinksProps) {
  return (
    <ul
      className={
        variant === "row"
          ? "flex flex-row items-center gap-8"
          : "flex flex-col items-center gap-6"
      }
    >
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            onClick={onLinkClick}
            data-cursor="nav"
            className={`rounded-sm font-medium text-zinc-600 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-900 active:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${linkClassName}`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
