/**
 * The sand name: every grain is a point with a target on one of the hero's letters.
 * Stateless per frame (no simulation buffers) — position is a pure function of time,
 * scroll, cursor and the grain's own random seeds, so it's cheap and fully reversible.
 *
 * 1. intro: grains ride the wind in from the left and settle into the letters
 * 2. cursor: grains near the pointer are pushed aside and swirl; they drift back as the
 *    stir decays
 * 3. scroll: the wind tears the name off the page and pours it toward the maw's centre
 */

export const sandVertexShader = /* glsl */ `
attribute vec2 aTarget;  // document-space CSS px
attribute vec4 aRand;

uniform vec2 uView;      // viewport, CSS px
uniform float uScroll;   // window.scrollY
uniform float uTime;     // seconds since the grains were laid out
uniform vec2 uMouse;     // CSS px
uniform float uStir;     // 0..1
uniform float uBlow;     // 0..1
uniform float uDpr;

varying float vAlpha;
varying float vHeat;
varying float vTone;

void main() {
  vec2 T = aTarget - vec2(0.0, uScroll);

  // 1. intro
  float delay = 0.15 + (aTarget.x / uView.x) * 0.9 + aRand.x * 0.6;
  float e = clamp((uTime - delay) / 1.8, 0.0, 1.0);
  float ease = 1.0 - pow(1.0 - e, 3.0);
  vec2 S = vec2(-80.0 - aRand.y * uView.x * 0.5, T.y + (aRand.z - 0.5) * uView.y * 0.8);
  vec2 pos = mix(S, T, ease);
  float fly = 1.0 - ease;
  pos += vec2(sin(uTime * 1.7 + aRand.w * 40.0), cos(uTime * 1.3 + aRand.x * 30.0)) * 46.0 * fly;
  pos += vec2(sin(uTime * 2.0 + aRand.z * 50.0), cos(uTime * 1.6 + aRand.y * 50.0)) * 0.35;

  // 2. cursor
  vec2 d = pos - uMouse;
  float dist = length(d);
  float R = 160.0;
  if (dist < R) {
    float f = pow(1.0 - dist / R, 2.0);
    vec2 n = d / max(dist, 0.001);
    vec2 swirl = vec2(-n.y, n.x) * (aRand.w - 0.5) * 2.0;
    pos += (n * 80.0 + swirl * 50.0) * f * uStir * (0.5 + aRand.x);
  }

  // 3. scroll
  float b = clamp(uBlow * (0.75 + aRand.y * 0.6) - aRand.z * 0.12, 0.0, 1.0);
  pos.y += uScroll * b; // detach from page scroll as the wind takes it
  vec2 wind = vec2(1.0, 0.16) * uView.x * 0.5 * b * b * (0.4 + aRand.x);
  vec2 toMaw = (vec2(uView.x * 0.5, uView.y * 0.52) - pos) * smoothstep(0.35, 1.0, b);
  pos += mix(wind, toMaw, smoothstep(0.3, 0.9, b));
  pos += vec2(sin(uTime * 3.0 + aRand.w * 20.0), cos(uTime * 2.5 + aRand.x * 20.0)) * 60.0 * b;

  vAlpha = (1.0 - smoothstep(0.75, 1.0, b)) * smoothstep(0.0, 0.12, e);
  vHeat = clamp(fly + b * 0.6, 0.0, 1.0);
  vTone = aRand.w;

  gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
  gl_PointSize = (1.5 + aRand.z * 1.5) * uDpr * (1.0 + fly * 0.7);
}
`;

export const sandFragmentShader = /* glsl */ `
precision highp float;
varying float vAlpha;
varying float vHeat;
varying float vTone;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.12, d) * vAlpha;
  if (a < 0.01) discard;
  vec3 ink = vec3(0.106, 0.059, 0.035);
  vec3 rust = vec3(0.49, 0.2, 0.09);
  vec3 sand = vec3(0.95, 0.8, 0.56);
  vec3 c = mix(ink, rust, vTone * 0.55);
  c = mix(c, sand, vHeat * 0.85); // grains in the air catch the light
  gl_FragColor = vec4(c, a);
}
`;
