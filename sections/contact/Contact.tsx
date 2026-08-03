import BackgroundGrid from "@/components/ui/BackgroundGrid";
import ContactHeader from "./ContactHeader";
import ContactCTA from "./ContactCTA";
import AvailabilityCard from "./AvailabilityCard";
import SocialLinks from "./SocialLinks";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-white px-6 py-32 md:py-40"
    >
      <BackgroundGrid className="opacity-60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.025),transparent_60%)]"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-14 text-center">
        <ContactHeader />
        <ContactCTA />
        <AvailabilityCard />
        <SocialLinks />
      </div>
    </section>
  );
}
