import Hero from "@/components/hero/Hero";
import JourneySection from "@/components/journey/JourneySection";
import Builds from "@/sections/builds/Builds";
import Awards from "@/sections/awards/Awards";
import Writing from "@/sections/writing/Writing";
import Contact from "@/sections/contact/Contact";
import Footer from "@/sections/contact/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <JourneySection />
      <Builds />
      <Awards />
      <Writing />
      <Contact />
      <Footer />
    </>
  );
}
