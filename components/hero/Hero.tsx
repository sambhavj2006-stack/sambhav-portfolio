import { heroFloatingObjects } from "@/data/hero-floating-objects";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import CursorField from "./CursorField";
import HeroPortrait from "./HeroPortrait";
import HeroHeading from "./HeroHeading";
import IdentityChips from "./IdentityChips";
import HeroCTA from "./HeroCTA";
import MobileProofStrip from "./MobileProofStrip";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-white px-6 py-28 md:py-0"
    >
      <BackgroundGrid />
      <CursorField objects={heroFloatingObjects} />

      <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-6 md:gap-4 lg:gap-4 xl:gap-6 min-[1440px]:gap-8">
        <HeroPortrait />
        <HeroHeading />
        <IdentityChips />
        <HeroCTA />
        <MobileProofStrip />
      </div>
    </section>
  );
}
