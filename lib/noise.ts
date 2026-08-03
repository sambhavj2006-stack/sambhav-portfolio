/**
 * Lightweight procedural drift for Sambhav OS — no external noise library needed.
 * Each widget gets a unique phase (seeded from its id) and its motion is three sine
 * waves at irrational-ish frequency ratios layered together. The combined period is
 * long enough that the loop is never perceptible, so it reads as organic breathing
 * rather than a mechanical oscillation.
 */

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h) || 1;
}

function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

export type DriftPhase = {
  x: number;
  y: number;
  z: number;
};

/** Derive stable, unique phase offsets for a widget from its id, so no two widgets breathe in sync. */
export function createDriftPhase(id: string): DriftPhase {
  const random = seededRandom(hashSeed(id));
  return {
    x: random() * Math.PI * 2,
    y: random() * Math.PI * 2,
    z: random() * Math.PI * 2,
  };
}

/**
 * Three layered sine waves (relative frequencies 1 / 0.53 / 0.29, weighted so the sum
 * stays within roughly [-1, 1]). `period` is the base cycle length in seconds.
 */
export function organicWave(t: number, phase: number, period: number): number {
  const w = (Math.PI * 2) / period;
  return (
    Math.sin(t * w + phase) * 0.55 +
    Math.sin(t * w * 0.53 + phase * 1.7) * 0.3 +
    Math.sin(t * w * 0.29 + phase * 2.3) * 0.15
  );
}
