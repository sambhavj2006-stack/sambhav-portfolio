import { heroFloatingObjects } from "@/data/hero-floating-objects";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import CursorField from "./CursorField";
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

      <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10">
        <HeroHeading />
        <IdentityChips />
        <HeroCTA />
        <MobileProofStrip />
      </div>
    </section>
  );
}
