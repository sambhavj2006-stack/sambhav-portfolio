/**
 * Turns the real hero <h1> into a cloud of grain targets. Each letter is an inline-block
 * span; we redraw every letter onto an offscreen canvas at exactly its laid-out position
 * (CSS half-leading model for the baseline), then sample filled pixels. Targets are in
 * document-space CSS px so the shader can scroll them with the page.
 */

export type SandTargets = {
  /** xy pairs, document CSS px */
  positions: Float32Array;
  count: number;
};

/**
 * `maxStep` caps the sampling grid (px). The actual step scales with the font size so the
 * letters read equally solid at every breakpoint — a fixed grid leaves a 40px phone
 * headline with only ~1k grains, too sparse to read.
 */
export function sampleHeroName(h1: HTMLElement, maxStep: number): SandTargets | null {
  const letters = Array.from(h1.querySelectorAll<HTMLElement>("[data-letter]"));
  if (!letters.length) return null;

  const box = h1.getBoundingClientRect();
  if (box.width < 2 || box.height < 2) return null;
  const style = getComputedStyle(letters[0]);
  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight) || fontSize;
  const font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
  const step = Math.min(maxStep, Math.max(1.05, fontSize / 68));

  const pad = 8;
  const w = Math.ceil(box.width + pad * 2);
  const h = Math.ceil(box.height + pad * 2);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.font = font;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText("M");
  const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
  const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;

  for (const span of letters) {
    const r = span.getBoundingClientRect();
    const baseline = r.top + (lineHeight - (ascent + descent)) / 2 + ascent;
    ctx.fillText(span.textContent ?? "", r.left + r.width / 2 - box.left + pad, baseline - box.top + pad);
  }

  const data = ctx.getImageData(0, 0, w, h).data;
  const out: number[] = [];
  const docLeft = box.left + window.scrollX - pad;
  const docTop = box.top + window.scrollY - pad;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      // the step is fractional — index whole pixels
      if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 128) {
        out.push(docLeft + x + (Math.random() - 0.5) * step, docTop + y + (Math.random() - 0.5) * step);
      }
    }
  }
  return { positions: new Float32Array(out), count: out.length / 2 };
}
