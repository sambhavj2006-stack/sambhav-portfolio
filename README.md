# Sambhav Jain — Portfolio

Personal site of Sambhav Jain. Live at https://sambhav-portfolio-two.vercel.app

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Motion.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live

| Path | What it is |
| --- | --- |
| `data/*.ts` | All site content: experience, awards, projects, numbers, contact |
| `lib/links.ts` | External links (LinkedIn, GitHub, Topmate, email, résumé, collab form) |
| `lib/motion.ts` | Every easing curve and spring used for animation |
| `components/system/` | The shared motion engine: pointer field, cursor, magnetic pull, reveals |
| `components/hero/`, `components/journey/`, `sections/` | Page sections, top to bottom |
| `components/ui/` | Small reusable pieces (buttons, cards, headings) |
| `public/` | Photos, logos and the résumé PDF |

To change content, edit the files in `data/`; no component changes needed.
Design and engineering rules for the project are in `CLAUDE.md`.

Deployed on Vercel: every push to `main` deploys automatically.
