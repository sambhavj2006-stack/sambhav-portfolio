import { heroFloatingObjects } from "@/data/hero-floating-objects";
import FloatingPlaceholder from "./FloatingPlaceholder";
import HeroHeading from "./HeroHeading";
import IdentityChips from "./IdentityChips";
import HeroCTA from "./HeroCTA";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-6">
      {heroFloatingObjects.map((object) => (
        <FloatingPlaceholder key={object.id} {...object} />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-10">
        <HeroHeading />
        <IdentityChips />
        <HeroCTA />
      </div>
    </section>
  );
}
