import Divider from "@/components/ui/Divider";
import AuthorLink from "@/components/ui/AuthorLink";
import { contactContent } from "@/data/contact";

export default function Footer() {
  const { footer } = contactContent;

  return (
    <footer className="w-full bg-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Divider />
        <div className="flex flex-col items-center gap-6 py-8 text-sm text-zinc-500 md:flex-row md:justify-between">
          <span>
            {footer.copyright} <AuthorLink className="text-zinc-500" />
          </span>
          <span className="text-zinc-400">{footer.tagline}</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-zinc-400">Built with</span>
            {footer.builtWith.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <p className="pb-2 text-center text-xs text-zinc-400">
          {footer.credit} <AuthorLink className="text-zinc-400" />.
        </p>
      </div>
    </footer>
  );
}
