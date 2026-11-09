import BackgroundGrid from "@/components/ui/BackgroundGrid";
import ScrollStage from "@/components/system/ScrollStage";
import ContactHeader from "./ContactHeader";
import ContactCTA from "./ContactCTA";
import AvailabilityCard from "./AvailabilityCard";
import SocialLinks from "./SocialLinks";

export default function Contact() {
  return (
    <ScrollStage
      id="contact"
      className="relative w-full overflow-hidden bg-white px-6 py-32 md:py-40"
    >
      <BackgroundGrid className="opacity-60" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-14 text-center">
        <ContactHeader />
        <ContactCTA />
        <AvailabilityCard />
        <SocialLinks />
      </div>
    </ScrollStage>
  );
}
