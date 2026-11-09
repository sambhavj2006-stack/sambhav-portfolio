import Hero from "@/sections/hero/Hero";
import Descent from "@/sections/descent/Descent";
import Tools from "@/sections/tools/Tools";
import Journey from "@/sections/journey/Journey";
import Awards from "@/sections/awards/Awards";
import Writing from "@/sections/writing/Writing";
import Contact from "@/sections/contact/Contact";

/** One journey, top to bottom: arrival at noon -> the descent -> the night inside -> dusk trek -> nightfall. */
export default function Home() {
  return (
    <>
      <Hero />
      <Descent />
      <Tools />
      <Journey />
      <Awards />
      <Writing />
      <Contact />
    </>
  );
}
