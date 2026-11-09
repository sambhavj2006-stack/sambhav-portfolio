/**
 * Deep Desert — the world state. The fixed WebGL backdrop (components/world) is one
 * painted desert whose mood is driven entirely by these numbers. Sections never talk
 * to the shader directly: each registers a "stop" (a scroll range + the mood it wants),
 * and every frame the scene folds all stops against the current scroll position.
 *
 * Folding is order-independent of React mount order and deterministic for any scroll
 * position (reload mid-page, anchor jumps), because a later stop's progress is only
 * non-zero once the earlier ones are complete.
 */

export type WorldMood = {
  /** 0 = closed, 1 = the maw has swallowed the whole screen */
  maw: number;
  /** 0 = day sky, 1 = deep night */
  night: number;
  /** 0 = none, 1 = full rust-orange dusk at the horizon */
  dusk: number;
  /** 0 = two small pale moons high up, 1 = large moons risen low on the horizon */
  moons: number;
  /** visibility of the lone figure on the ridge */
  figure: number;
  /** 0..1 darkening veil, keeps long reading sections legible */
  veil: number;
  /** 0 = the maw opens/closes in place (entering); 1 = it dives back into the sand as it
   *  closes (leaving) — set once you're fully inside, so the exit reads as the worm sinking */
  sink: number;
};

export const ARRIVAL_MOOD: WorldMood = {
  maw: 0,
  night: 0,
  dusk: 0,
  moons: 0,
  figure: 1,
  veil: 0,
  sink: 0,
};

type Stop = {
  mood: Partial<WorldMood>;
  /** document-space scroll range [start, end] in px */
  range: () => [number, number];
};

const stops: Stop[] = [];

export function registerWorldStop(stop: Stop) {
  stops.push(stop);
  return () => {
    const index = stops.indexOf(stop);
    if (index !== -1) stops.splice(index, 1);
  };
}

/** Document-space top of an element. */
export function documentTop(el: Element) {
  return el.getBoundingClientRect().top + window.scrollY;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Writes the mood for the current scroll position into `out`. */
export function computeWorldMood(out: WorldMood) {
  Object.assign(out, ARRIVAL_MOOD);
  const y = window.scrollY;
  const resolved = stops
    .map((stop) => ({ mood: stop.mood, range: stop.range() }))
    .sort((a, b) => a.range[0] - b.range[0]);

  for (const { mood, range } of resolved) {
    const [start, end] = range;
    const p = Math.min(Math.max((y - start) / Math.max(end - start, 1), 0), 1);
    if (p === 0) continue;
    const t = smooth(p);
    for (const key of Object.keys(mood) as (keyof WorldMood)[]) {
      out[key] += (mood[key]! - out[key]) * t;
    }
  }
}

/** Shared pointer position, normalized -1..1 — written by the scene's single listener. */
export const worldPointer = { x: 0, y: 0 };
