/**
 * Deep Desert — the painted world, entirely procedural (no images). One full-screen
 * fragment shader: sky -> sun/moons -> stars -> four dune layers -> the lone figure ->
 * blowing sand -> the maw -> grain. Every mood parameter comes from lib/world.ts.
 *
 * Coordinates: `p` is aspect-correct, origin at screen centre, y up, y in [-0.5, 0.5].
 */

export const desertVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const desertFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uMaw;
uniform float uNight;
uniform float uDusk;
uniform float uMoons;
uniform float uFigure;
uniform float uVeil;
uniform float uSink;

varying vec2 vUv;

#define PI 3.14159265
#define HORIZON -0.12

// ---------------------------------------------------------------- noise
float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise1(float x) {
  float i = floor(x), f = fract(x);
  return mix(hash11(i), hash11(i + 1.0), f * f * (3.0 - 2.0 * f));
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
// value noise whose x axis wraps every 'period' cells — seamless around a circle
float noiseWrapX(vec2 p, float period) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x0 = mod(i.x, period), x1 = mod(i.x + 1.0, period);
  return mix(mix(hash21(vec2(x0, i.y)), hash21(vec2(x1, i.y)), u.x),
             mix(hash21(vec2(x0, i.y + 1.0)), hash21(vec2(x1, i.y + 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

// ---------------------------------------------------------------- palette by mood
vec3 skyTop() {
  vec3 c = mix(vec3(0.95, 0.88, 0.74), vec3(0.24, 0.11, 0.13), uDusk);
  return mix(c, vec3(0.012, 0.018, 0.05), uNight);
}
vec3 skyHorizon() {
  vec3 c = mix(vec3(0.88, 0.62, 0.38), vec3(0.88, 0.40, 0.16), uDusk);
  return mix(c, mix(vec3(0.06, 0.08, 0.16), vec3(0.32, 0.12, 0.08), uDusk * 0.6), uNight);
}
vec3 sandLit() {
  vec3 c = mix(vec3(0.93, 0.72, 0.47), vec3(0.86, 0.45, 0.22), uDusk);
  return mix(c, vec3(0.20, 0.20, 0.30), uNight);
}
vec3 sandShade() {
  vec3 c = mix(vec3(0.64, 0.36, 0.20), vec3(0.32, 0.12, 0.09), uDusk);
  return mix(c, vec3(0.045, 0.045, 0.09), uNight);
}

// ---------------------------------------------------------------- sky elements
vec3 stars(vec2 p) {
  vec3 c = vec3(0.0);
  for (int l = 0; l < 2; l++) {
    float scale = l == 0 ? 70.0 : 150.0;
    vec2 g = p * scale + float(l) * 31.7;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id);
    if (h > 0.955) {
      vec2 o = vec2(hash21(id + 3.1), hash21(id + 7.7)) - 0.5;
      float d = length(f - o * 0.6);
      float tw = 0.55 + 0.45 * sin(uTime * (0.8 + h * 2.5) + h * 40.0);
      float b = smoothstep(0.14, 0.0, d) * tw * (l == 0 ? 1.0 : 0.55);
      c += b * mix(vec3(1.0, 0.88, 0.72), vec3(0.72, 0.86, 1.0), hash21(id + 1.3));
    }
  }
  return c;
}

vec3 nebula(vec2 p) {
  float w = fbm(p * 1.6 + vec2(uTime * 0.006, 0.0));
  float n = fbm(p * 2.2 + w * 1.8);
  vec3 c = vec3(0.10, 0.17, 0.32) * n * n * 0.9;
  c += vec3(0.42, 0.14, 0.07) * pow(fbm(p * 1.3 + 7.0 + w), 3.0) * 0.55;
  return c;
}

// draws a shaded moon, returns updated colour
vec3 moon(vec3 col, vec2 p, vec2 c, float r, float vis, float seed) {
  vec2 d2 = p - c;
  float d = length(d2);
  // halo
  col += vec3(1.0, 0.92, 0.78) * exp(-max(d - r, 0.0) * 22.0) * 0.12 * vis;
  if (d < r * 1.02) {
    vec3 n = vec3(d2 / r, sqrt(max(1.0 - dot(d2, d2) / (r * r), 0.0)));
    vec3 L = normalize(vec3(-0.6, 0.35, 0.7));
    float shade = clamp(dot(n, L), 0.0, 1.0);
    float crater = fbm(n.xy * 3.5 + seed);
    vec3 mc = vec3(0.96, 0.90, 0.80) * (0.18 + 0.82 * shade) * (0.78 + 0.35 * crater);
    float edge = smoothstep(r, r - 0.0025, d);
    col = mix(col, mc, edge * vis);
  }
  return col;
}

// ---------------------------------------------------------------- dunes
float duneShape(float x) {
  float n = noise1(x);
  float ridge = 1.0 - abs(2.0 * n - 1.0);
  return pow(ridge, 1.6) * 0.75 + 0.25 * noise1(x * 2.7 + 3.1);
}
float duneH(float x, float base, float amp, float freq, float seed) {
  return base + amp * duneShape(x * freq + seed);
}

vec3 paintDune(vec3 col, vec2 p, float xs, float base, float amp, float freq, float seed,
               float fog, float detail) {
  float h = duneH(xs, base, amp, freq, seed);
  if (p.y > h) return col;
  // Light/shadow split follows the slope a little *behind* each point, sheared with depth,
  // so the terminator from a crest curves down the face instead of dropping straight
  // (a straight drop reads as blocks, not sand).
  float depth = h - p.y;
  float xl = xs - depth * 0.9 + (fbm(vec2(xs * 3.0, depth * 9.0) + seed) - 0.5) * 0.05;
  float e = 0.006;
  float slope = (duneH(xl + e, base, amp, freq, seed) - duneH(xl - e, base, amp, freq, seed)) / (2.0 * e);
  float lit = smoothstep(-0.35, 0.45, slope);
  vec3 c = mix(sandShade(), sandLit(), lit);
  // painterly brushwork + wind ripples
  c *= 0.9 + 0.2 * fbm(vec2(xs * 5.0, p.y * 13.0) + seed);
  float ripple = sin(xs * 70.0 + (h - p.y) * 240.0 + fbm(p * 7.0 + seed) * 7.0);
  c *= 1.0 + 0.035 * ripple * detail * (1.0 - uNight * 0.6);
  // sun-catching crest
  c += sandLit() * smoothstep(0.007, 0.0, h - p.y) * lit * 0.22;
  // aerial perspective
  c = mix(c, skyHorizon(), fog);
  return c;
}

// wind-blown sand lifting off a crest
vec3 spray(vec3 col, vec2 p, float xs, float h, float wind, float strength) {
  float d = p.y - h;
  if (d < 0.0 || d > 0.07) return col;
  float s = fbm(vec2((xs - uTime * 0.09 * wind) * 9.0, d * 46.0 - uTime * 0.3));
  float a = smoothstep(0.07, 0.0, d) * smoothstep(0.5, 0.85, s) * strength * (1.0 - uNight * 0.7);
  return mix(col, mix(sandLit(), skyHorizon(), 0.4), a);
}

// ---------------------------------------------------------------- the lone figure
float figureMask(vec2 q, float wind) {
  // q: local space, feet at origin. A hooded, cloaked walker ~0.058 tall.
  float H = 0.046;
  float t = clamp(q.y / H, 0.0, 1.0);
  // robe: narrow shoulders flaring to the hem; the hem streams downwind and flutters
  float flutter = sin(uTime * 3.4 + q.y * 260.0) * 0.0011 * (1.0 - t) * (1.0 - t);
  float trail = -(1.0 - t) * (1.0 - t) * 0.0075 * wind;
  float halfW = mix(0.0105, 0.0055, pow(t, 0.7));
  float robe = step(0.0, q.y) * step(q.y, H) * step(abs(q.x - trail - flutter), halfW);
  // hood: a slightly forward-tilted oval
  vec2 hq = q - vec2(0.0012, H + 0.0048);
  float hood = step(length(hq * vec2(1.0, 0.82)), 0.0058);
  // a staff, planted ahead of the walker
  float staff = step(abs(q.x - 0.0125 - q.y * 0.06), 0.0008) * step(0.0, q.y) * step(q.y, H * 1.18);
  return max(max(robe, hood), staff);
}

// ---------------------------------------------------------------- main
void main() {
  vec2 frag = gl_FragCoord.xy;
  float ax = uRes.x / uRes.y;
  vec2 p = (frag - 0.5 * uRes) / uRes.y;
  float wind = 1.0 + uMouse.x * 0.8;

  // ---- the maw: polar frame around the screen centre
  // leaving (uSink=1), the closing maw also slides down — the worm dives back under
  float closing = (1.0 - uMaw) * uSink;
  vec2 mc = vec2(0.0, -0.02 - closing * 0.95);
  float diag = length(vec2(ax * 0.5, 0.5)) + 0.04;
  float R = pow(uMaw, 1.35) * diag / 0.72;
  float r = length(p - mc);

  // sand being dragged toward the maw: swirl the outside world
  vec2 ps = p;
  if (uMaw > 0.001 && uMaw < 0.999) {
    float pull = uMaw * (1.0 - uMaw) * 3.0;
    float ang = pull * 0.12 / (r + 0.12);
    vec2 d = p - mc;
    float cs = cos(ang), sn = sin(ang);
    ps = mc + vec2(cs * d.x - sn * d.y, sn * d.x + cs * d.y);
  }

  // heat shimmer near the horizon in daylight
  float haze = (1.0 - uNight) * (1.0 - uDusk * 0.6) * smoothstep(0.06, -0.12, ps.y - HORIZON);
  ps.x += sin(ps.y * 140.0 + uTime * 2.6) * 0.0012 * haze;

  // horizontal dune coordinate: portrait screens see more dunes per width
  float xstretch = mix(1.7, 1.0, clamp(ax, 0.0, 1.0));

  // ---------------------------------------------------------------- sky
  float sk = smoothstep(HORIZON, 0.55, ps.y);
  vec3 col = mix(skyHorizon(), skyTop(), pow(sk, 0.8));

  // painterly swirling cloud bands (ref: the spiralling poster skies)
  vec2 cq = ps * vec2(1.1, 2.8) + vec2(uTime * 0.008, 0.0);
  float w1 = fbm(cq);
  float w2 = fbm(cq * 1.7 + w1 * 2.2 + 4.0);
  vec3 cloudCol = mix(mix(vec3(1.0, 0.94, 0.82), vec3(0.98, 0.58, 0.34), uDusk), vec3(0.10, 0.11, 0.20), uNight);
  col = mix(col, cloudCol, smoothstep(0.48, 0.86, w2) * 0.28 * smoothstep(HORIZON, 0.1, ps.y));

  // sun glow (day)
  vec2 sunPos = vec2(-min(0.42, ax * 0.5 - 0.12), 0.24);
  float sun = exp(-length(ps - sunPos) * 4.5);
  col += vec3(1.0, 0.86, 0.6) * sun * 0.32 * (1.0 - uNight) * (1.0 - uDusk * 0.4);

  // stars + nebula at night
  col += (stars(ps) + nebula(ps) * 0.8) * uNight * smoothstep(HORIZON - 0.02, HORIZON + 0.15, ps.y);

  // two moons
  float mx = min(0.42, ax * 0.5 - 0.16);
  // risen (uMoons=1): large, low, pushed to the right edge so it frames — never sits
  // behind — the headline on the left
  // (portrait screens are text top to bottom, so there it peeks in from the top-right corner)
  vec2 risen = mix(vec2(ax * 0.5 - 0.02, 0.37), vec2(ax * 0.5 - 0.1, 0.02), step(1.0, ax));
  vec2 moonA = mix(vec2(mx, 0.27), risen, uMoons);
  float ra = mix(0.055, 0.2 * clamp(ax, 0.55, 1.0), uMoons);
  float moonVis = mix(0.38, 1.0, max(uNight, uDusk * 0.7));
  col = moon(col, ps, moonA + vec2(-ra * 1.55, ra * 0.35), ra * 0.36, moonVis, 9.0);
  col = moon(col, ps, moonA, ra, moonVis, 2.0);

  // ---------------------------------------------------------------- dunes (far -> near)
  float par = uMouse.x * 0.012;
  float x0 = ps.x * xstretch;
  col = paintDune(col, ps, x0 + par * 0.3, HORIZON - 0.00, 0.06, 2.2, 11.0, 0.55, 0.3);
  col = paintDune(col, ps, x0 + par * 0.6, HORIZON - 0.07, 0.08, 1.6, 23.0, 0.36, 0.5);
  float x2 = x0 + par * 1.0;
  float h2 = duneH(x2, HORIZON - 0.16, 0.11, 1.15, 37.0);
  col = paintDune(col, ps, x2, HORIZON - 0.16, 0.11, 1.15, 37.0, 0.18, 0.8);
  col = spray(col, ps, x2, h2, wind, 0.25);

  // the figure stands on the nearest ridge, right of centre
  float x3 = x0 + par * 1.6;
  float fxScreen = min(0.3, ax * 0.5 - 0.14);
  float fxDune = fxScreen * xstretch + par * 1.6;
  float fy = duneH(fxDune, HORIZON - 0.30, 0.16, 0.8, 51.0);
  float fig = figureMask(ps - vec2(fxScreen, fy - 0.002), wind) * uFigure;

  float h3 = duneH(x3, HORIZON - 0.30, 0.16, 0.8, 51.0);
  col = paintDune(col, ps, x3, HORIZON - 0.30, 0.16, 0.8, 51.0, 0.04, 1.0);
  col = spray(col, ps, x3, h3, wind, 0.4);
  vec3 figCol = mix(vec3(0.11, 0.06, 0.045), vec3(0.02, 0.02, 0.04), uNight);
  col = mix(col, figCol, fig);

  // drifting motes across the whole lower world
  float motes = smoothstep(0.86, 0.97, noise(vec2(ps.x * 26.0 - uTime * 0.5 * wind, ps.y * 60.0 + uTime * 0.15)));
  col += sandLit() * motes * 0.08 * (1.0 - uNight * 0.5) * smoothstep(0.1, -0.4, ps.y);

  // ---------------------------------------------------------------- the maw
  if (R > 0.0005) {
    vec2 d = p - mc;
    float a = atan(d.y, d.x) / (2.0 * PI) + 0.5; // 0..1, seam-free with noiseWrapX
    // an irregular, living rim rather than a perfect circle
    float wobble = noiseWrapX(vec2(a * 18.0, uTime * 0.15), 18.0) * 0.06
                 + noiseWrapX(vec2(a * 70.0, 3.0), 70.0) * 0.018;
    float rr = r / (R * (0.97 + wobble));
    if (rr < 1.0) {
      float tun = log(max(rr, 0.0005));

      // strands converging into the throat, flowing inward over time
      float s1 = noiseWrapX(vec2(a * 90.0, tun * 2.2 - uTime * 0.35), 90.0);
      float s2 = noiseWrapX(vec2(a * 220.0, tun * 4.0 - uTime * 0.55), 220.0);
      float strand = smoothstep(0.55, 0.95, s1) * 0.75 + smoothstep(0.72, 1.0, s2) * 0.45;

      vec3 throat = mix(vec3(0.10, 0.045, 0.03), vec3(0.008, 0.012, 0.035), uNight);
      vec3 strandCol = mix(vec3(0.66, 0.37, 0.21), vec3(0.33, 0.56, 0.74), uNight);
      float depth = smoothstep(0.0, 0.95, rr);

      vec3 inside = throat;
      inside += (stars(p * 0.9) * 1.3 + nebula(p * 0.8)) * uNight;
      inside += strandCol * strand * depth * mix(0.9, 0.45, uNight);
      inside *= mix(0.25, 1.0, depth) + uNight * 0.6;

      // ---- inward-curving teeth: uneven lengths, slight hook, dusty and shadowed at the root
      float N = 96.0;
      float cell = floor(a * N);
      float hk = hash11(cell + 4.0);
      float len = 0.035 + 0.07 * hk * hk;
      float rootR = 0.84;
      float tt = clamp((rootR - rr) / len, 0.0, 1.0);          // 0 at root -> 1 at tip
      float local = fract(a * N + tt * 0.35 * (hk - 0.5)) * 2.0 - 1.0; // hooked sideways
      float widthAt = (1.0 - pow(tt, 0.7)) * mix(0.55, 0.95, hash11(cell + 9.0));
      float isTooth = step(abs(local), widthAt) * step(rr, rootR) * step(rootR - len, rr);
      vec3 toothCol = mix(vec3(0.78, 0.66, 0.50), vec3(0.36, 0.38, 0.48), uNight);
      toothCol *= mix(0.45, 1.05, tt) * (0.85 + 0.25 * (1.0 - abs(local)));

      // ---- the lip: fibrous flesh with radial striations (the bristled rim)
      float fib = noiseWrapX(vec2(a * 260.0, rr * 6.0), 260.0) * 0.55
                + noiseWrapX(vec2(a * 55.0, rr * 18.0), 55.0) * 0.45;
      vec3 lipDeep = mix(vec3(0.30, 0.11, 0.06), vec3(0.05, 0.04, 0.08), uNight * 0.85);
      vec3 lipHi = mix(vec3(0.80, 0.50, 0.27), vec3(0.22, 0.20, 0.30), uNight * 0.85);
      float lipT = smoothstep(rootR - 0.01, 1.0, rr);
      vec3 lipCol = mix(lipDeep, lipHi, smoothstep(0.25, 0.9, fib) * (0.35 + 0.65 * lipT));
      // the rim's outer edge catches sand-light; its inner edge falls into shadow
      lipCol += lipHi * smoothstep(0.93, 0.995, rr) * 0.35;
      lipCol *= mix(0.55, 1.0, lipT);
      float lip = smoothstep(rootR - 0.005, rootR + 0.012, rr);

      // sand pouring over the rim into the throat
      float pour = smoothstep(0.62, 0.95, noiseWrapX(vec2(a * 140.0, tun * 3.0 - uTime * 1.2), 140.0));
      inside += sandLit() * pour * smoothstep(0.45, rootR, rr) * 0.22 * (1.0 - uNight);

      inside = mix(inside, toothCol, isTooth * (1.0 - lip));
      inside = mix(inside, lipCol, lip);
      // soft inner shadow under the rim
      inside *= 1.0 - 0.5 * smoothstep(rootR - 0.12, rootR, rr) * (1.0 - lip) * (1.0 - isTooth);
      col = inside;
    } else {
      // a sunken bowl of shadowed sand just outside the lip
      col *= 1.0 - 0.5 * smoothstep(1.22, 1.0, rr);
    }
  }

  // ---------------------------------------------------------------- finish
  col = mix(col, vec3(0.015, 0.02, 0.05), uVeil);
  vec2 v = vUv - 0.5;
  col *= 1.0 - 0.42 * pow(length(v * vec2(1.0, 1.15)) * 1.25, 2.2);
  col += (hash21(frag + fract(uTime * 7.0) * 113.0) - 0.5) * 0.05;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
