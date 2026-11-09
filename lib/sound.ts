/**
 * Deep Desert — the sound engine. Web Audio, created only after the visitor turns sound
 * on (a user gesture, so browsers allow it). All audio is original, generated with
 * ElevenLabs; files live in public/audio.
 *
 * Layers follow the world (lib/world `liveMood`), not scroll directly:
 * - music bed: loops; a low-pass closes as you fall into the maw (muffled, underground)
 *   and opens again in the night sky inside it
 * - wind: synthesized live (filtered noise with slow gusts — never repeats, zero bytes);
 *   loudest in open daylight, fades at night and inside the maw
 * - rumble: one-shot each time the maw starts opening
 * - tick: one-shot on any link/button click
 */

import { liveMood } from "./world";

const FILES = {
  music: "/audio/ambience.mp3",
  rumble: "/audio/rumble.mp3",
  tick: "/audio/tick.mp3",
} as const;

/** Seconds of overlap when the music bed loops — long enough that the seam is inaudible. */
const MUSIC_CROSSFADE_S = 8;

type Layer = keyof typeof FILES;

const MASTER_LEVEL = 0.9;
const MUSIC_LEVEL = 0.55;
const WIND_LEVEL = 0.32;
const RUMBLE_LEVEL = 0.8;
const TICK_LEVEL = 0.18;
const FADE_S = 1.6;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private buffers: Partial<Record<Layer, AudioBuffer>> = {};
  private loading: Promise<void> | null = null;
  private raf = 0;
  private mawArmed = true;
  private listeners = new Set<(on: boolean) => void>();
  on = false;

  subscribe(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.on));
  }

  private async setup() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 18000;
    this.filter.connect(this.master);

    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = MUSIC_LEVEL;
    this.musicGain.connect(this.filter);

    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0;
    this.windGain.connect(this.master);

    const entries = await Promise.all(
      (Object.keys(FILES) as Layer[]).map(async (layer) => {
        const res = await fetch(FILES[layer]);
        const data = await res.arrayBuffer();
        return [layer, await ctx.decodeAudioData(data)] as const;
      })
    );
    for (const [layer, buffer] of entries) this.buffers[layer] = buffer;

    this.scheduleMusic(ctx.currentTime + 0.05);
    this.startWind(ctx, this.windGain);
  }

  private musicTimer = 0;

  /** Overlapping copies of the bed, each faded in/out across MUSIC_CROSSFADE_S. */
  private scheduleMusic(at: number) {
    const ctx = this.ctx;
    const buffer = this.buffers.music;
    if (!ctx || !buffer || !this.musicGain) return;
    const xf = MUSIC_CROSSFADE_S;
    const len = buffer.duration;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(1, at + xf);
    env.gain.setValueAtTime(1, at + len - xf);
    env.gain.linearRampToValueAtTime(0, at + len);
    env.connect(this.musicGain);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(env);
    src.start(at);
    src.onended = () => env.disconnect();
    this.musicNext = at + len - xf;
    this.armMusicTimer();
  }

  private musicNext = 0;

  /** Queues the next overlapping copy ~2s before it's due. Paused while sound is off
   *  (the context is suspended, so its clock stops — a running timer would pile up copies). */
  private armMusicTimer() {
    const ctx = this.ctx;
    window.clearTimeout(this.musicTimer);
    if (!ctx || !this.musicNext) return;
    this.musicTimer = window.setTimeout(
      () => this.scheduleMusic(this.musicNext),
      Math.max((this.musicNext - ctx.currentTime - 2) * 1000, 0)
    );
  }

  /** Wind: brown-ish noise through a band-pass whose centre and level drift in slow gusts,
   *  plus a faint high hiss of grains. */
  private startWind(ctx: AudioContext, out: GainNode) {
    const seconds = 6;
    const noise = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 420;
    band.Q.value = 0.6;
    const gust = ctx.createOscillator();
    gust.frequency.value = 0.06;
    const gustDepth = ctx.createGain();
    gustDepth.gain.value = 260;
    gust.connect(gustDepth).connect(band.frequency);

    const swell = ctx.createGain();
    swell.gain.value = 0.75;
    const swellLfo = ctx.createOscillator();
    swellLfo.frequency.value = 0.045;
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = 0.25;
    swellLfo.connect(swellDepth).connect(swell.gain);

    const hiss = ctx.createBiquadFilter();
    hiss.type = "highpass";
    hiss.frequency.value = 3200;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.12;

    src.connect(band).connect(swell).connect(out);
    src.connect(hiss).connect(hissGain).connect(swell);
    src.start();
    gust.start();
    swellLfo.start();
  }

  private oneShot(layer: Layer, level: number) {
    const buffer = this.buffers[layer];
    if (!this.ctx || !this.master || !buffer || !this.on) return;
    const gain = this.ctx.createGain();
    gain.gain.value = level;
    gain.connect(this.master);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(gain);
    src.start();
  }

  /** Follows the world each frame; cheap (a few param ramps). */
  private follow = () => {
    this.raf = requestAnimationFrame(this.follow);
    const ctx = this.ctx;
    if (!ctx || !this.filter || !this.windGain) return;
    const { maw, night } = liveMood;
    const now = ctx.currentTime;

    // muffled while the maw is open but you haven't reached the night sky inside it
    const underground = maw * (1 - night);
    const cutoff = 18000 * Math.pow(500 / 18000, underground);
    this.filter.frequency.setTargetAtTime(cutoff, now, 0.25);

    const wind = WIND_LEVEL * (1 - night * 0.75) * (1 - maw * 0.85);
    this.windGain.gain.setTargetAtTime(wind, now, 0.4);

    // the rumble fires once per opening, re-arming once the maw has closed again
    if (this.mawArmed && maw > 0.06) {
      this.mawArmed = false;
      this.oneShot("rumble", RUMBLE_LEVEL);
    } else if (!this.mawArmed && maw < 0.02) {
      this.mawArmed = true;
    }
  };

  private onClick = (event: MouseEvent) => {
    if ((event.target as Element | null)?.closest?.("a, button")) {
      this.oneShot("tick", TICK_LEVEL);
    }
  };

  async enable() {
    if (this.on) return;
    this.on = true;
    this.emit();
    try {
      if (!this.ctx) {
        this.loading ??= this.setup();
        await this.loading;
      }
      await this.ctx!.resume();
      this.armMusicTimer();
      // don't fire the rumble just for turning sound on mid-descent
      this.mawArmed = liveMood.maw < 0.02;
      const now = this.ctx!.currentTime;
      this.master!.gain.cancelScheduledValues(now);
      this.master!.gain.setTargetAtTime(MASTER_LEVEL, now, FADE_S / 3);
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(this.follow);
      window.addEventListener("click", this.onClick, { capture: true });
    } catch {
      this.on = false;
      this.emit();
    }
  }

  disable() {
    if (!this.on) return;
    this.on = false;
    this.emit();
    window.removeEventListener("click", this.onClick, { capture: true });
    window.clearTimeout(this.musicTimer);
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0, now, FADE_S / 4);
    window.setTimeout(() => {
      if (!this.on) {
        cancelAnimationFrame(this.raf);
        ctx.suspend();
      }
    }, FADE_S * 1000);
  }

  toggle() {
    if (this.on) this.disable();
    else void this.enable();
  }
}

export const sound = new SoundEngine();
