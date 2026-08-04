import Image from "next/image";
import Reveal from "@/components/system/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { contactContent } from "@/data/contact";

export default function ContactHeader() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Reveal className="w-24 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_20px_40px_-12px_rgba(0,0,0,0.16)]">
        <Image
          src="/photos/gallery/front-shot.jpeg"
          alt="Sambhav Jain, smiling"
          width={480}
          height={384}
          loading="lazy"
          sizes="6rem"
          className="aspect-5/4 h-auto w-full object-cover object-top"
        />
      </Reveal>
      <Reveal blur delay={0.1}>
        <SectionHeading
          heading={contactContent.headline}
          description={contactContent.description}
          align="center"
        />
      </Reveal>
    </div>
  );
}
