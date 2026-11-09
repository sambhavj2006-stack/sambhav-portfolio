import Hero from "@/sections/hero/Hero";
import Descent from "@/sections/descent/Descent";
import Archive from "@/sections/archive/Archive";
import Craft from "@/sections/craft/Craft";
import Signal from "@/sections/signal/Signal";
import Contact from "@/sections/contact/Contact";

/** Arrival at noon -> the descent -> the Archive inside the maw -> dusk (what I do) -> signal -> nightfall. */
export default function Home() {
  return (
    <>
      <Hero />
      <Descent />
      <Archive />
      <Craft />
      <Signal />
      <Contact />
    </>
  );
}
