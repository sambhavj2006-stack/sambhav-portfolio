import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { contactContent } from "@/data/contact";

export default function ContactHeader() {
  return (
    <Reveal>
      <SectionHeading
        heading={contactContent.headline}
        description={contactContent.description}
        align="center"
      />
    </Reveal>
  );
}
