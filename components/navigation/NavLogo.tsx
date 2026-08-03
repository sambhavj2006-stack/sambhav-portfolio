import Magnetic from "@/components/system/Magnetic";

export default function NavLogo({ scrolled }: { scrolled: boolean }) {
  return (
    <Magnetic radius={60} strength={0.25}>
      <a
        href="#top"
        className={`inline-block origin-left text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${
          scrolled ? "scale-90" : "scale-100"
        }`}
      >
        Sambhav Jain
      </a>
    </Magnetic>
  );
}
