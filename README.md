# Sambhav Jain — Portfolio

Personal site of Sambhav Jain: everything he's built, what he does, and where he writes.
Live at https://sambhav-portfolio-two.vercel.app

Built with Next.js, TypeScript, Tailwind CSS v4, Three.js (React Three Fiber), Motion and Lenis.
The desert world is a single procedural GLSL shader (no images); the hero name is
GPU-rendered sand; the soundtrack and effects are original (ElevenLabs).

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Adding things

| To add… | Edit |
| --- | --- |
| A project, tool or piece of work | `data/works.ts` — one entry; optional cover image in `public/works/`. `featured: true` makes it a large exhibit |
| A LinkedIn post | `data/posts.ts` — URL, opening line, date (optional image in `public/posts/`) |
| A link (LinkedIn, Topmate, collab form…) | `lib/links.ts` |

## Where things live

| Path | What it is |
| --- | --- |
| `sections/` | Page sections, in order: hero, descent, archive, craft, signal, contact |
| `components/world/` | The WebGL desert (`desertShader.ts`) and the sand name (`SandName.tsx`) |
| `lib/world.ts` | The world's mood model, driven by scroll |
| `lib/sound.ts` | The sound engine (`public/audio/`) |
| `lib/motion.ts` | Every easing curve and spring |

Design and engineering rules are in `CLAUDE.md`. Every push to `main` deploys on Vercel.
