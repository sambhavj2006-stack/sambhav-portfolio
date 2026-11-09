# Sambhav Portfolio — Deep Desert

## Project Vision

Sambhav Jain's personal site and the link he sends people for **the tools he's built**.
One cinematic journey across an original desert world: arrival at noon -> a descent
through a sandworm-like maw -> the tools, inside a night sky -> the career as a trek
across dunes at dusk -> contact at nightfall under two risen moons.

Tone: awe through scale and restraint. A couple of unforgettable moments (the descent),
everything else calm, legible, generously spaced. References: painted desert posters
(tiny figure, vast world) for mood; two19labs.in for restraint and type.

**IP rule:** the world is *inspired by* desert sci-fi, never a copy of it. Never use the
"Dune" name, its logotype, characters, film stills, poster art or score on the site.
All art is procedural (the shader); all audio must be original (see Audio).

## Tech Stack

- Next.js (App Router) + TypeScript, Tailwind CSS v4
- `three` + `@react-three/fiber` + `@react-three/postprocessing` — the WebGL world
- `motion` — every UI and scroll-linked animation (one engine; no GSAP)
- `lenis` — weighted smooth scroll (off under reduced motion)
- All content is real and lives in `data/*.ts` — never invent facts, dates, numbers or
  tool descriptions. Tool copy comes from the tool's own site/README.

## Architecture

- `lib/world.ts` — the world's mood (`maw`, `night`, `dusk`, `moons`, `figure`, `veil`,
  `sink`). Sections register **stops** (scroll range + target mood); every frame the
  scene folds them against `scrollY`. Deterministic for any scroll position.
- `components/world/` — `WorldBackdrop` (fixed, lazy, CSS fallback + `no-webgl`),
  `WorldScene` (R3F canvas, eases toward the mood), `desertShader.ts` (the entire
  painted world in one fragment shader), `useWorldStop` / `WorldStopMarker`.
- `sections/*` — one folder per section, in page order (see `app/page.tsx`).
- `components/ui/` — `Button`, `SectionHeading`, `OrgMark`. `components/system/` —
  `Reveal`, `SmoothScroll`, `useSettledReducedMotion`.
- `lib/motion.ts` — every easing curve and spring. Don't define springs anywhere else.
- `data/tools.ts` — add a tool here (with a real screenshot in `public/tools/`) and it
  appears automatically.

## Design Language

- Tokens in `app/globals.css` `@theme`: sand, ochre, rust, bone, ink, night, and one
  accent — `eye` blue — used sparingly (live status, focus rings).
- Type: `font-display` (Syncopate, uppercase, bold) for titles only; Geist for body;
  Geist Mono uppercase-tracked for labels/metadata.
- Text over the day sky is `ink`; everything after the descent is `bone` on night.
- Section openers always use `SectionHeading` (mono index / label + display title).

## Engineering Rules

- Components under ~200 lines; compose, don't duplicate.
- Never call motion's raw `useReducedMotion` — use `useSettledReducedMotion`.
- Reduced motion: world time freezes (still frame, still changes mood), Lenis off, the
  trek becomes a vertical list, entrances skip.
- Low power / touch: lower DPR, no bloom. No hover-only affordances (pair with
  `active:`/`whileTap`).
- Performance: one canvas, one shader pass + bloom; nothing per-frame goes through React
  state; content never waits on WebGL.
- Verify visual changes with screenshots across scroll positions (desktop + 390px).

## Audio (planned)

Original ambience/SFX generated with ElevenLabs — wind, low drone, the maw's rumble, soft
UI ticks. Off by default with a visible toggle. Reference material in `/jhik` (local
only, gitignored) is for mood — never shipped.

## Working Style — Autonomous

For scoped work: read the code, decide, implement fully, fix lint/type/build errors,
verify visually, then report. Ask first only for new dependencies, secrets, deleting
functionality, or a genuinely two-way product decision.
