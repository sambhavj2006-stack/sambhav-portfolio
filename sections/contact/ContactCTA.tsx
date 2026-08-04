import Button from "@/components/ui/Button";
import Magnetic from "@/components/system/Magnetic";
import Reveal from "@/components/system/Reveal";
import { contactContent } from "@/data/contact";

export default function ContactCTA() {
  return (
    <Reveal
      className="flex flex-wrap items-center justify-center gap-4"
      delay={0.1}
    >
      <Magnetic>
        <Button href={contactContent.primaryCta.href} variant="primary">
          {contactContent.primaryCta.label}
        </Button>
      </Magnetic>
      <Magnetic>
        <Button href={contactContent.collabCta.href} variant="secondary">
          {contactContent.collabCta.label}
        </Button>
      </Magnetic>
      <Magnetic>
        <Button href={contactContent.secondaryCta.href} variant="secondary">
          {contactContent.secondaryCta.label}
        </Button>
      </Magnetic>
    </Reveal>
  );
}
