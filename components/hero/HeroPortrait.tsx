import Image from "next/image";
import Reveal from "@/components/system/Reveal";
import heroPortrait from "@/public/photos/hero/hero-headshot.jpeg";

/**
 * The one portrait Hero is allowed: the professional headshot, the site's identity. Native
 * ~4:5 aspect ratio (1119x1406) already matches the crop below almost exactly, so
 * object-cover trims only a sliver — never the forehead or chin. Uses the same rounded-2xl
 * / tier-1 shadow language as FloatingCard and Reveal's standard blur entrance — no new
 * visual or motion primitive introduced for this.
 *
 * Sizing is intentionally NOT a smooth scale-up: md (768-1023, tablet) is where the
 * floating proof cards are most crowded and the vertical budget on short landscape
 * viewports (e.g. the classic 1024x768) is tightest — see the tabletClassName comment in
 * hero-floating-objects.ts. lg+ dropped two of the five original floating cards (v2), so
 * it has real headroom back and the portrait grows accordingly; it only reaches its full
 * "identity" size on true mobile (cards hidden entirely) and true desktop (>=1440).
 */
export default function HeroPortrait() {
  return (
    <Reveal
      blur
      className="relative w-34 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_20px_40px_-12px_rgba(0,0,0,0.16)] sm:w-38 md:w-30 lg:w-36 xl:w-40 min-[1440px]:w-56"
    >
      <Image
        src={heroPortrait}
        alt="Sambhav Jain"
        priority
        placeholder="blur"
        sizes="(min-width: 1440px) 14rem, (min-width: 1024px) 9rem, (min-width: 768px) 7.5rem, 9.5rem"
        className="aspect-4/5 h-auto w-full object-cover object-center"
      />
    </Reveal>
  );
}
