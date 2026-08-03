# Sambhav Portfolio — Sambhav OS

## Project Vision

Sambhav Jain's personal site — Builder, Consultant, President, Creator. Not a template,
not a résumé rendered as HTML: a single living "engineering desk" surface that moves the
way its owner thinks. The benchmark is the feeling of Linear, Apple, Vercel, Stripe —
never their literal look.

The design system has a name — **Sambhav OS** — and it is now established, not
experimental. Every session extends it. **No session redesigns it.**

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- `motion` (Framer Motion) for all animation
- All content is real (résumé-sourced) and lives in `data/*.ts` — never invent facts,
  dates, or numbers; if something is missing, leave it out rather than guess.

## Sambhav OS — the motion engine

Everything reactive on this site reads from **one** shared engine instead of rolling its
own listeners or one-off physics:

- `components/system/PointerFieldProvider.tsx` — the single window-level `pointermove`
  listener for the entire app, exposed via `useSurfaceField()`. Carries raw/normalized
  cursor position, decaying speed, presence, a shared `elapsed` clock (drives procedural
  drift), and `scrollProgress`. Hydration-safe: `prefersReducedMotion` and
  `isCoarsePointer` settle via `useSyncExternalStore` so SSR and the client's first paint
  always agree (see `useSettledReducedMotion.ts` — never call `motion`'s raw
  `useReducedMotion` directly, it *will* cause a hydration mismatch).
- `components/system/CursorInstrument.tsx` — replaces the system cursor with a ring+dot
  that morphs via `data-cursor="click"|"pull"|"view"` attributes. Off entirely under
  reduced motion / coarse pointers (native cursor returns).
- `components/system/Magnetic.tsx` — cursor-pull for CTAs/nav marks; degrades to a
  `whileTap` press-yield on touch instead of going inert.
- `components/system/Reveal.tsx` — the one scroll-reveal primitive; every section
  entrance uses this (optionally `blur` for major headlines), never a hand-rolled
  `whileInView` block.
- `components/system/ScrollStage.tsx` — wraps top-level sections so they gain clarity
  entering the viewport and ease back slightly leaving it (the "cinematic handoff"
  between sections). Applied to Journey → Contact; not Hero (nothing to hand off *from*)
  or Footer (nothing after it).
- `components/hero/FloatingCard.tsx` — the drift/repulsion/depth physics for Hero's
  floating widgets. Motion density is responsive
  (`motionScaleForWidth`: desktop 100%, laptop 85%, tablet 70%), and drift math is
  skipped entirely for widgets currently `display:none` (checked via measured rect, not
  a media query) — hidden cards must never keep animating.
- `lib/motion.ts` — every easing curve and spring constant in the system. Adding a new
  spring anywhere else is a regression; put it here.
- `lib/noise.ts` — layered-sine procedural drift, not literal noise/particles.

**Breakpoint model**: mobile `<768`, tablet `768–1023`, laptop `1024–1439`, true desktop
`≥1440` (`xl`). Each tier is composed intentionally — tablet/laptop are not desktop
scaled down, and mobile is not a compressed desktop. Hero's floating cards use
hand-authored literal Tailwind strings (`tabletClassName` in `data/hero-floating-objects.ts`)
because Tailwind's scanner cannot see dynamically-*constructed* class names — never
build a class via `` `${x}:block` ``, only pick between literal pre-written strings.

## Design Language

- Monochrome zinc/neutral palette. No gradients, no bright color, no glassmorphism.
- Editorial typography, generous whitespace, restrained "engineering desk" motifs
  (drafting grid, coordinate readouts, self-drawing rails) — always subtle, never noisy.
- `OrgMark` (`components/ui/OrgMark.tsx`) — every organization gets a consistent
  minimalist monogram, not a scraped/fabricated logo. This is deliberate: an inaccurate
  reproduction of a real brand mark is worse than a clean fallback. If real logo files
  are ever supplied (`public/logos/`), wire them in as an `OrgMark` override — don't mix
  real and fabricated marks.
- One hover language: `SPRING_TRANSITION` for lift/elevation, `MAGNETIC_SPRING` for
  pull, `EASE_SIGNATURE` for every reveal. Any new interactive surface (cards, buttons,
  links) should reuse these, not invent a new feel.

## Engineering Rules

- Build reusable components; never duplicate motion/physics logic — extend the engine
  above instead of adding a parallel one.
- Keep components under ~200 lines where practical.
- Prefer composition over repetition.
- Accessibility: `prefers-reduced-motion` must be respected everywhere (via
  `useSettledReducedMotion`, not the raw hook); no hover-only affordances without a
  touch-equivalent (`whileTap`, `active:` states).
- Performance: reuse the shared PointerField instead of new listeners; motion values
  over React state for anything that changes per-frame; pause/skip work for
  offscreen/hidden elements.

## Working Style — Autonomous

This project runs in autonomous execution mode. For scoped implementation work: read the
code, decide the approach, implement it fully, fix lint/type/build errors, verify
visually (dev server + screenshots) when the change is visual, then report. Don't ask
"should I proceed?" mid-task.

Only pause and ask first when:
- A new dependency must be installed.
- A secret/API key is required.
- Existing architecture would have to fundamentally change.
- Existing functionality would need to be deleted.
- Two genuinely different product directions are both defensible.
- There's a real risk of data/work loss.

**The one standing constraint above all others: do not redesign Sambhav OS.** Typography,
spacing philosophy, color palette, and component architecture are final. Every session
extends the system — new content, new sections, deeper physics, better responsive
composition, small delightful details — never a different visual language.
