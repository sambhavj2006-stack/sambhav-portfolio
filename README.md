# Sambhav Jain — Portfolio

Personal site of Sambhav Jain, and the home for the tools he's built.
Live at https://sambhav-portfolio-two.vercel.app

Built with Next.js, TypeScript, Tailwind CSS v4, Three.js (React Three Fiber), Motion and Lenis.
The desert world behind the page is a single procedural GLSL shader — no images.

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
| `data/tools.ts` | **The tools.** Add an entry (+ a screenshot in `public/tools/`) to list a new one |
| `data/*.ts` | All other content: experience, awards, projects, numbers, contact |
| `lib/links.ts` | External links (LinkedIn, GitHub, Topmate, email, résumé, collab form) |
| `lib/world.ts` | The world's mood model, driven by scroll |
| `components/world/` | The WebGL desert (`desertShader.ts` is the painting) |
| `sections/` | Page sections, in order: hero, descent, tools, journey, awards, writing, contact |
| `lib/motion.ts` | Every easing curve and spring |

Design and engineering rules are in `CLAUDE.md`. Every push to `main` deploys on Vercel.
