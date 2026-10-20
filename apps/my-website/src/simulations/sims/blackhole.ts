// Kerr black hole with a thin accretion disc.
//
// Two-stage rendering ("preprocessing" of the light paths):
//  1. BAKE: for every pixel, integrate the null geodesic backwards from the
//     camera (RK4 on Hamilton's equations in Kerr-Schild coordinates) and
//     store where it ends up: escape direction (sky) or capture, plus up to
//     three crossings of the equatorial plane (radius, azimuth, redshift g).
//     A 1/4-resolution preview is traced instantly; the full 4K ray map is
//     then traced progressively in tiles (centre-out) over a few frames.
//  2. DISPLAY: every frame, shade the ray map: animated differentially
//     rotating disc of streaky gas (blackbody emission with Doppler +
//     gravitational shift and relativistic beaming), lensed HDR star map,
//     camera azimuth. None of these require re-tracing, so animation runs at
//     full 4K frame rate.

import type { Engine } from "../gl/engine";
import { FBO, Program, bindFBO, createFBO, deleteFBO } from "../gl/gl";
import { SKY_GLSL } from "../gl/sky";
import { SPECTRUM_GLSL } from "../gl/spectrum";
import { DEG, HudItem, Params, Readouts, Simulation, SimulationDescriptor, SimStatus, bool, num, str } from "./types";
import { horizonOmega, horizonRadius, iscoRadius, kerrCamera, photonOrbitRadius } from "./kerr";
import { skyRotation } from "./skyrot";

const RECORD_MAX = 45;

const BAKE_FS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uRes;
uniform float uA;
uniform vec3 uCamPos;
uniform mat4 uTetrad;
uniform mat4 uG;
uniform float uZoom;
uniform float uStep;
uniform int uMaxSteps;
uniform float uRecordMax;
uniform float uEscape;
uniform float uDiscSense;
layout(location = 0) out vec4 oDir;
layout(location = 1) out vec4 oHit0;
layout(location = 2) out vec4 oHit1;
layout(location = 3) out vec4 oHit2;

float A, A2;

// Boyer-Lindquist-like radius from Kerr-Schild Cartesian coordinates
float rOf(vec3 p) {
  float rho2 = dot(p, p) - A2;
  return sqrt(0.5 * (rho2 + sqrt(rho2 * rho2 + 4.0 * A2 * p.z * p.z)));
}
// g = eta + f k k,  k_mu = (-1, k);  inverse g^ = eta - f K K,  K^mu = (1, k)
void ks(vec3 p, out float f, out vec3 k) {
  float r = rOf(p);
  float r2 = r * r;
  float d = r2 + A2;
  k = vec3((r * p.x - A * p.y) / d, (r * p.y + A * p.x) / d, p.z / r);
  f = 2.0 * r2 * r / (r2 * r2 + A2 * p.z * p.z);
}
// H = 1/2 (-p0^2 + |p|^2 - W),  W = f (p0 + k.p)^2
float W(vec3 x, vec3 pv, float p0) {
  float f; vec3 k;
  ks(x, f, k);
  float s = p0 + dot(k, pv);
  return f * s * s;
}
void deriv(vec3 x, vec3 pv, float p0, out vec3 dx, out vec3 dp) {
  float f; vec3 k;
  ks(x, f, k);
  float s = p0 + dot(k, pv);
  dx = pv - f * s * k;                       // dH/dp
  float e = 1e-3 * max(1.0, length(x));
  vec3 ex = vec3(e, 0.0, 0.0), ey = vec3(0.0, e, 0.0), ez = vec3(0.0, 0.0, e);
  dp = (0.25 / e) * vec3(W(x + ex, pv, p0) - W(x - ex, pv, p0),
                         W(x + ey, pv, p0) - W(x - ey, pv, p0),
                         W(x + ez, pv, p0) - W(x - ez, pv, p0));   // -dH/dx
}
// redshift factor g = nu_observed / nu_emitted for a circular equatorial orbit
float redshift(float r, vec3 ip, float p0, vec3 pv) {
  float s = uDiscSense;
  float sr = sqrt(r);
  float r15 = r * sr;
  float den = r15 - 3.0 * sr + 2.0 * s * A;
  if (den <= 0.0) return 0.0;                // no circular orbit here
  float ut = (r15 + s * A) / (pow(r, 0.75) * sqrt(den));
  float om = s / (r15 + s * A);
  float pu = ut * (p0 + om * (-ip.y * pv.x + ip.x * pv.y));
  return 1.0 / abs(pu);
}

void main() {
  A = uA;
  A2 = A * A;
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.x;
  vec3 dir = normalize(vec3(-uZoom, uv));
  vec4 p = uG * (uTetrad * vec4(-1.0, dir));
  float p0 = p.x;
  vec3 pv = p.yzw;
  vec3 x = uCamPos;
  float rH = 1.0 + sqrt(max(0.0, 1.0 - A2));

  vec4 h0 = vec4(0.0), h1 = vec4(0.0), h2 = vec4(0.0);
  int nh = 0;
  float status = 0.0;
  for (int i = 0; i < 10000; i++) {
    if (i >= uMaxSteps) break;
    float r = rOf(x);
    if (r < rH) { status = 0.0; break; }
    if (r > uEscape) { status = 1.0; break; }
    float h = uStep * max(r - rH, 0.25);
    vec3 k1x, k1p, k2x, k2p, k3x, k3p, k4x, k4p;
    deriv(x, pv, p0, k1x, k1p);
    deriv(x + 0.5 * h * k1x, pv + 0.5 * h * k1p, p0, k2x, k2p);
    deriv(x + 0.5 * h * k2x, pv + 0.5 * h * k2p, p0, k3x, k3p);
    deriv(x + h * k3x, pv + h * k3p, p0, k4x, k4p);
    vec3 nx = x + (h / 6.0) * (k1x + 2.0 * (k2x + k3x) + k4x);
    vec3 np = pv + (h / 6.0) * (k1p + 2.0 * (k2p + k3p) + k4p);
    if (x.z * nx.z < 0.0 && nh < 3) {
      float t = x.z / (x.z - nx.z);
      vec3 ip = mix(x, nx, t);
      vec3 ipp = mix(pv, np, t);
      float rc = rOf(ip);
      if (rc < uRecordMax && rc > rH) {
        vec4 hit = vec4(rc, atan(ip.y, ip.x), redshift(rc, ip, p0, ipp), 1.0);
        if (nh == 0) h0 = hit; else if (nh == 1) h1 = hit; else h2 = hit;
        nh++;
      }
    }
    x = nx;
    pv = np;
  }
  vec3 dx, dp;
  deriv(x, pv, p0, dx, dp);
  oDir = vec4(normalize(dx), status);
  oHit0 = h0;
  oHit1 = h1;
  oHit2 = h2;
}`;

const DISPLAY_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uDir, uHit0, uHit1, uHit2;      // full-res ray map
uniform sampler2D uPDir, uPHit0, uPHit1, uPHit2;  // preview ray map
uniform samplerCube uSky;
uniform sampler2D uDiscTex;
uniform sampler2D uNoise;   // tileable fbm for ragged clump outlines
uniform vec2 uRes;
uniform float uAzimuth;
uniform float uDiscTime;
uniform float uA, uDiscSense;
uniform float uRin, uRout;
uniform float uTemp, uDoppler, uDiscGain, uOpacity;
uniform float uClouds, uCoverage, uClumpSize, uConcentration;
uniform int uColorMode;
uniform int uShowDisc;
uniform int uShowSky;
${SKY_GLSL}
${SPECTRUM_GLSL}
out vec4 o;

vec3 rotZ(vec3 v, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c * v.x - s * v.y, s * v.x + c * v.y, v.z);
}
// thin-disc (Novikov-Thorne-like) temperature profile, peak = 1 at r = 49/36 rin
float tProfile(float r) {
  float x = max(r / uRin, 1.0);
  return pow(x, -0.75) * pow(max(1.0 - inversesqrt(x), 0.0), 0.25) / 0.48788;
}
float omegaK(float r) { return uDiscSense / (r * sqrt(r) + uDiscSense * uA); }   // Keplerian angular velocity
vec2 discUV(vec4 hit) {
  float r = max(hit.x, 0.5);
  float ang = hit.y + uAzimuth - omegaK(r) * uDiscTime;
  return vec2(ang / (2.0 * PI), log(r / uRin) / log(uRout / uRin));
}
void grads(vec2 uv, out vec2 gx, out vec2 gy) {
  gx = dFdx(uv); gy = dFdy(uv);
  gx.x -= round(gx.x); gy.x -= round(gy.x);              // azimuth wraps
  gx = clamp(gx, -0.5, 0.5); gy = clamp(gy, -0.5, 0.5);     // across image boundaries
}
// dp: azimuth and ln r derivatives along screen x and y, for filtering the clumps
struct Crossing { vec2 uv, gx, gy; vec4 dp; };
Crossing crossing(vec4 hit) {
  Crossing c;
  c.uv = discUV(hit);
  grads(c.uv, c.gx, c.gy);
  float s = log(max(hit.x, 0.5));
  vec2 dphi = vec2(dFdx(hit.y), dFdy(hit.y));
  dphi -= 2.0 * PI * round(dphi / (2.0 * PI));
  c.dp = clamp(vec4(dphi, dFdx(s), dFdy(s)), -0.5, 0.5);
  return c;
}

vec4 hash43(vec3 p) {
  vec4 q = fract(p.xyzx * vec4(0.1031, 0.1030, 0.0973, 0.1099));
  q += dot(q, q.wzxy + 33.33);
  return fract((q.xxyz + q.yzzw) * q.zywx);
}
// normalised radius: 0 at the inner edge, 1 at the outer edge
float discQ(float r) { return clamp(log(r / uRin) / log(uRout / uRin), 0.0, 1.0); }
// chance that a cell holds a clump: the gas gets denser towards the hole
float clumpChance(float r) {
  return clamp(uCoverage * exp(uConcentration * (1.0 - 2.5 * discQ(r))), 0.0, 1.0);
}
// One octave of gas streaks on a polar grid: annuli of width delta in ln r, each
// rotating rigidly at its own Keplerian rate. A streak keeps its shape as it
// orbits while neighbouring annuli slide past each other, so nothing winds up
// and nothing has to fade in or out. Cells are "aspect" times longer along the
// orbit than across it, so the streaks are long and thin like the sheared gas
// of the Interstellar disc; slow noise in each annulus' frame makes them
// undulate. Kernels are pre-filtered by the pixel footprint and fade to their
// mean once a pixel covers several cells.
// Returns (density, heat-weighted, lit-weighted density).
vec3 streakOctave(float phi, float s, vec4 dp, float delta, float aspect, float seed) {
  float N = floor(2.0 * PI / (delta * aspect));
  float toCell = N / (2.0 * PI);
  vec2 fa = dp.xy * toCell, fs = dp.zw / delta;           // pixel footprint in cells
  float fx2 = 0.2 * dot(fa, fa), fy2 = 0.2 * dot(fs, fs);
  float mean = clumpChance(exp(s)) * 0.66;
  float fade = smoothstep(0.35, 0.9, sqrt(max(dot(fa, fa), dot(fs, fs))));
  if (fade >= 1.0) return vec3(mean, 0.5 * mean, 0.0);
  float sc = s / delta;
  float k0 = floor(sc);
  // noise frequency, a whole number of periods around; low enough (with the
  // blur below) that the warp never folds over and creases a streak
  vec2 nf = vec2(round(N * 0.1) / N, 0.2);
  vec3 acc = vec3(0.0);
  for (int dk = -1; dk <= 1; dk++) {
    float k = k0 + float(dk);
    float rk = exp((k + 0.5) * delta);
    float p = clumpChance(rk);
    float a = (phi - mod(omegaK(rk) * uDiscTime, 2.0 * PI)) * toCell;
    a -= N * floor(a / N);
    float j0 = floor(a);
    float lod = log2(max(length(vec2(fa.x, fs.x) * nf), length(vec2(fa.y, fs.y) * nf)) * 512.0);
    vec3 n = textureLod(uNoise, vec2(a, sc) * nf + vec2(0.0, seed * 0.31), max(lod, 4.5)).rgb;
    vec2 warp = vec2(0.3, 0.5) * (n.rg - 0.5);
    // the outer gas breaks up into patchy wisps
    float mottle = mix(0.75 + 0.5 * n.b, 0.1 + 1.8 * n.b * n.b, smoothstep(0.3, 1.0, discQ(rk)));
    for (int dj = -1; dj <= 1; dj++) {
      float j = j0 + float(dj);
      vec4 h = hash43(vec3(mod(j, N), k, seed));
      if (h.x >= p) continue;
      vec4 h2 = hash43(vec3(k + 71.0, mod(j, N), seed + 13.0));
      // Compact kernel. Its support (incl. jitter, tilt, warp and footprint
      // blur) stays inside the 3x3 cells searched: an unsearched centre is
      // >= 1.2 cells away in azimuth and >= 1.25 radially, so streaks are
      // never cut off. Varied lengths; mostly faint with a few bright ones.
      float rx = mix(0.35, 0.72, h.w), ry = mix(0.3, 0.7, h2.x);
      float dy = sc - (k + 0.5 + 0.5 * (h.z - 0.5)) + warp.y;
      float dx = a - (j + 0.5 + 0.6 * (h.y - 0.5)) + 0.1 * dy + warp.x;
      float vx = min(rx * rx + fx2, 0.55), vy = min(ry * ry + fy2, 0.8);
      float q = dx * dx / vx + dy * dy / vy;
      float w = 1.0 - min(q, 1.0);
      float g = 4.0 * exp(-2.5 * q) * w * w * rx * ry * inversesqrt(vx * vy) * (0.5 + 1.5 * h2.y * h2.y) * mottle;
      // h2.z: hotter or cooler streak; lit on the side facing the hole
      acc += g * vec3(1.0, h2.z, clamp(-dy * inversesqrt(vy), -1.0, 1.0));
    }
  }
  return mix(acc, vec3(mean, 0.5 * mean, 0.0), fade);
}

float hash11(float x) { return fract(sin(x * 127.1 + 311.7) * 43758.5453); }
float noise1(float x) {
  float i = floor(x), f = fract(x);
  return mix(hash11(i), hash11(i + 1.0), f * f * (3.0 - 2.0 * f));
}
// Concentric lanes, like the grooves of a record: 1D noise in ln r. Being
// axisymmetric, they look the same however the disc turns, so they never wind
// up or flicker. Octaves finer than a pixel fade to their mean.
float lanes(float s, float ds) {
  float v = 0.0, amp = 0.5, f = 14.0 / uClumpSize, norm = 0.0;
  for (int o = 0; o < 5; o++) {
    float n = noise1(s * f + float(o) * 17.3);
    v += amp * mix(n, 0.5, smoothstep(0.2, 0.5, ds * f));
    norm += amp;
    f *= 2.4;
    amp *= 0.7;
  }
  v /= norm;
  return smoothstep(0.18, 0.82, v);
}

vec4 shade(vec4 hit, Crossing c, float refY) {
  if (uShowDisc == 0 || hit.w < 0.5 || hit.x < uRin || hit.x > uRout || hit.z <= 0.0) return vec4(0.0);
  vec4 tx = textureGrad(uDiscTex, c.uv, c.gx, c.gy);
  float edge = smoothstep(uRout, mix(uRout, uRin, 0.25), hit.x);
  // Interstellar look: concentric lanes, with long thin streaks of gas sliding
  // along them at their own orbital speeds, over the fine streak texture
  float phi = hit.y + uAzimuth, s = log(hit.x), delta = 0.05 * uClumpSize;
  vec3 st = vec3(0.0);
  float ln = 1.0;
  if (uClouds > 0.0) {
    // broad streaks inside, fine hair-like wisps further out
    float qo = discQ(hit.x);
    st = mix(1.0, 0.5, qo) * streakOctave(phi, s, c.dp, delta, 12.0, 1.0)
       + 0.8 * streakOctave(phi, s, c.dp, 0.4 * delta, 18.0, 2.0)
       + mix(0.5, 1.1, qo) * streakOctave(phi, s, c.dp, 0.16 * delta, 28.0, 3.0);
    ln = lanes(s, max(abs(c.dp.z), abs(c.dp.w)));
  }
  float prof = exp(uConcentration * (1.0 - 2.0 * discQ(hit.x)));   // denser towards the hole
  // the lanes are subtle in the smooth, hot inner disc and deep in the outer wisps
  float laneDepth = mix(0.25, 0.75, smoothstep(0.0, 0.8, discQ(hit.x))) * uClouds;
  float bg = tx.r * (0.4 + 0.4 * uCoverage) * mix(1.0, 0.35, smoothstep(0.3, 1.0, discQ(hit.x)) * uClouds);
  float d = (1.0 - laneDepth + laneDepth * ln) * (bg + 1.2 * st.x) * prof;
  float tau = 0.5 * d * edge;
  float cover = 1.0 - exp(-tau);                       // optical depth: thin gas translucent, dense gas opaque
  float heat = clamp(0.5 + 0.6 * ((st.y + 0.025) / (st.x + 0.05) - 0.5) + 0.15 * st.z / (st.x + 0.05), 0.0, 1.0);
  float T = uTemp * tProfile(hit.x) * mix(0.8 + 0.4 * tx.g, 0.8 + 0.4 * heat, uClouds);
  float g = hit.z;
  vec3 e;
  if (uColorMode == 0) {
    e = planck(T * pow(g, uDoppler)) / refY;           // D^3 B(nu/D, T) = B(nu, D T)
  } else {
    // as in aroussel's shader / Interstellar: fixed hue, beaming ~ g^3.
    // Hotter gas is tinted slightly whiter, cooler gas slightly redder.
    float t = T / uTemp;
    e = planckRaw(uTemp * (1.0 + 0.25 * uClouds * (heat - 0.5))).rgb * t * t * pow(g, 3.0 * uDoppler);
  }
  // classic streaks: emission and opacity proportional to density
  float dens = tx.r * edge;
  vec4 classic = vec4(e * dens, uOpacity * dens);
  // dense gas keeps brightening (column density) instead of saturating
  // As in Interstellar, the inner disc glows far brighter than the wispy outer gas
  // (the tone mapping then turns it nearly white while the outer gas stays orange).
  float glow = exp(uConcentration * 2.6 * (1.0 - 2.0 * discQ(hit.x)));
  vec4 gas = vec4(e * (0.35 * cover + 0.1 * min(tau, 12.0)) * glow, uOpacity * cover);
  vec4 res = mix(classic, gas, uClouds);
  return vec4(res.rgb * uDiscGain, clamp(res.a, 0.0, 1.0));
}
void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  vec4 d = texelFetch(uDir, ip, 0);
  vec4 h0, h1, h2;
  if (d.w < -0.5) {
    vec2 uv = gl_FragCoord.xy / uRes;
    d = texture(uPDir, uv);
    h0 = texture(uPHit0, uv); h1 = texture(uPHit1, uv); h2 = texture(uPHit2, uv);
  } else {
    h0 = texelFetch(uHit0, ip, 0); h1 = texelFetch(uHit1, ip, 0); h2 = texelFetch(uHit2, ip, 0);
  }
  vec3 sky = skyColor(uSky, rotZ(d.xyz, uAzimuth));
  vec3 col = (d.w > 0.5 && uShowSky == 1) ? sky : vec3(0.0);

  float refY = exp2(planckRaw(uTemp).a * 3.32192809489);
  // derivatives need uniform control flow, so take them before shading
  Crossing c0 = crossing(h0), c1 = crossing(h1), c2 = crossing(h2);
  vec4 s2 = shade(h2, c2, refY);
  vec4 s1 = shade(h1, c1, refY);
  vec4 s0 = shade(h0, c0, refY);
  col = col * (1.0 - s2.a) + s2.rgb;
  col = col * (1.0 - s1.a) + s1.rgb;
  col = col * (1.0 - s0.a) + s0.rgb;
  o = vec4(col, 1.0);
}`;

// Procedural disc texture in (azimuth, log-radius) space, seamless in azimuth:
// fine turbulent streaks + clumps, like the Interstellar disc. It is the whole
// disc in the classic look and the diffuse gas between the clumps otherwise.
const DISC_TEX_FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uSize;
out vec4 o;
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash33(i).x, hash33(i + vec3(1,0,0)).x, f.x),
                 mix(hash33(i + vec3(0,1,0)).x, hash33(i + vec3(1,1,0)).x, f.x), f.y),
             mix(mix(hash33(i + vec3(0,0,1)).x, hash33(i + vec3(1,0,1)).x, f.x),
                 mix(hash33(i + vec3(0,1,1)).x, hash33(i + vec3(1,1,1)).x, f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { s += a * noise(p); p = p * 2.02 + 7.3; a *= 0.5; }
  return s;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float ang = uv.x * 6.28318530718;
  vec2 c = vec2(cos(ang), sin(ang));
  float rad = uv.y;
  // streaks: low angular, high radial frequency
  float warp = fbm(vec3(c * 1.5, rad * 6.0)) * 0.6;
  float rings = fbm(vec3(c * 2.5, rad * 70.0 + warp * 8.0));
  float fine = fbm(vec3(c * 12.0, rad * 140.0 + warp * 3.0));
  float clumps = fbm(vec3(c * 6.0, rad * 18.0 + 3.0));
  float dens = smoothstep(0.25, 0.75, rings) * 0.75 + 0.25;
  dens *= 0.55 + 0.9 * fine;
  dens *= 0.6 + 0.7 * clumps;
  o = vec4(clamp(dens, 0.0, 1.0), clumps, 0.0, 1.0);
}`;

// Tileable fbm (periodic value noise), three independent channels, contrast
// stretched around 0.5: warps and mottles the gas clumps.
const NOISE_FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uSize;
out vec4 o;
float hash(vec2 p, float seed) {
  vec3 q = fract(vec3(p.xyx) * 0.1031 + seed * 0.1373);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float pnoise(vec2 p, float period, float seed) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(mod(i, period), seed), hash(mod(i + vec2(1, 0), period), seed), f.x),
             mix(hash(mod(i + vec2(0, 1), period), seed), hash(mod(i + vec2(1, 1), period), seed), f.x), f.y);
}
float pfbm(vec2 uv, float seed) {
  float s = 0.0, a = 0.5, period = 8.0;
  for (int i = 0; i < 5; i++) { s += a * pnoise(uv * period, period, seed + float(i) * 3.7); period *= 2.0; a *= 0.5; }
  return clamp(0.5 + (s / 0.96875 - 0.5) * 2.5, 0.0, 1.0);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  o = vec4(pfbm(uv, 1.0), pfbm(uv, 23.0), pfbm(uv, 47.0), 1.0);
}`;

interface Tile { x: number; y: number; w: number; h: number }

class BlackHole implements Simulation {
  private bake: Program;
  private display: Program;
  private discTex: WebGLTexture;
  private noiseTex: WebGLTexture;
  private full: FBO | null = null;
  private preview: FBO | null = null;
  private geomKey = "";
  private tiles: Tile[] = [];
  private tileIdx = 0;
  private tilesPerFrame = 2;
  private lastChange = 0;
  private lastRender = 0;
  private bakeUniforms: Record<string, number | number[] | Float32Array> = {};
  private azAuto = 0;
  private discTime = 0;
  private camLapse = 1;

  constructor(private engine: Engine, private text: Readouts["blackhole"]) {
    const ctx = engine.ctx;
    const gl = ctx.gl;
    this.bake = new Program(ctx, BAKE_FS);
    this.display = new Program(ctx, DISPLAY_FS);
    // bake the disc streak texture and the clump noise once
    const fb = gl.createFramebuffer()!;
    const bakeTexture = (fs: string, W: number, H: number, wrapT: number) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texStorage2D(gl.TEXTURE_2D, Math.floor(Math.log2(Math.max(W, H))) + 1, gl.RGBA8, W, H);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
      if (ctx.anisoExt) gl.texParameterf(gl.TEXTURE_2D, ctx.anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, ctx.caps.anisotropy));
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
      gl.viewport(0, 0, W, H);
      const p = new Program(ctx, fs);
      p.use().set({ uSize: [W, H] }).draw();
      p.dispose();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.generateMipmap(gl.TEXTURE_2D);
      return tex;
    };
    this.discTex = bakeTexture(DISC_TEX_FS, 4096, 1024, gl.CLAMP_TO_EDGE);
    this.noiseTex = bakeTexture(NOISE_FS, 512, 512, gl.REPEAT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
  }

  private ensureTargets(w: number, h: number) {
    if (this.full && this.full.width === w && this.full.height === h) return;
    const ctx = this.engine.ctx;
    const gl = ctx.gl;
    deleteFBO(ctx, this.full);
    deleteFBO(ctx, this.preview);
    const f32 = { internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT };
    const f16 = { internalFormat: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT };
    this.full = createFBO(ctx, w, h, [f32, f32, f16, f16]);
    this.preview = createFBO(ctx, Math.ceil(w / 4), Math.ceil(h / 4), [f32, f32, f16, f16]);
    this.geomKey = "";
  }

  private makeTiles(w: number, h: number) {
    const T = 256;
    const tiles: Tile[] = [];
    for (let y = 0; y < h; y += T) for (let x = 0; x < w; x += T) tiles.push({ x, y, w: Math.min(T, w - x), h: Math.min(T, h - y) });
    const cx = w / 2, cy = h / 2;
    tiles.sort((a, b) => Math.hypot(a.x + a.w / 2 - cx, a.y + a.h / 2 - cy) - Math.hypot(b.x + b.w / 2 - cx, b.y + b.h / 2 - cy));
    return tiles;
  }

  private runBake(target: FBO, tiles: Tile[] | null) {
    const gl = this.engine.gl;
    bindFBO(this.engine.ctx, target);
    this.bake.use().set({ ...this.bakeUniforms, uRes: [target.width, target.height] });
    if (tiles) {
      gl.enable(gl.SCISSOR_TEST);
      for (const t of tiles) {
        gl.scissor(t.x, t.y, t.w, t.h);
        this.bake.draw();
      }
      gl.disable(gl.SCISSOR_TEST);
    } else {
      this.bake.draw();
    }
  }

  render(params: Params, frame: { time: number; dt: number; width: number; height: number }) {
    const gl = this.engine.gl;
    const now = performance.now();
    const W = frame.width, H = frame.height;
    this.ensureTargets(W, H);
    const a = num(params, "spin");
    const sense = str(params, "discDir") === "retro" ? -1 : 1;

    // ---- geometry (re)trace ----
    const quality = str(params, "quality");
    const q = quality === "high" ? [0.05, 4000] : quality === "draft" ? [0.2, 800] : [0.1, 2000];
    const key = [a, sense, num(params, "distance"), num(params, "inclination"), num(params, "fov"), quality, W, H].join("|");
    if (key !== this.geomKey) {
      this.geomKey = key;
      const cam = kerrCamera(a, num(params, "distance"), num(params, "inclination") * DEG);
      this.camLapse = cam.lapse;
      this.bakeUniforms = {
        uA: a,
        uCamPos: [cam.pos[1], cam.pos[2], cam.pos[3]],
        uTetrad: cam.tetrad,
        uG: cam.g,
        uZoom: 1 / Math.tan((num(params, "fov") * DEG) / 2),
        uStep: q[0],
        uMaxSteps: q[1],
        uRecordMax: RECORD_MAX,
        uEscape: Math.max(1000, num(params, "distance") * 20),
        uDiscSense: sense,
      };
      this.runBake(this.preview!, null);
      bindFBO(this.engine.ctx, this.full!);
      gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, -1]);
      for (let i = 1; i < 4; i++) gl.clearBufferfv(gl.COLOR, i, [0, 0, 0, 0]);
      this.tiles = this.makeTiles(W, H);
      this.tileIdx = 0;
      this.lastChange = now;
    }
    // progressive full-resolution trace (after interaction settles)
    if (this.tileIdx < this.tiles.length && now - this.lastChange > 120) {
      const frameMs = now - this.lastRender;
      if (frameMs < 24) this.tilesPerFrame = Math.min(this.tilesPerFrame + 1, 96);
      else if (frameMs > 45) this.tilesPerFrame = Math.max(1, Math.floor(this.tilesPerFrame * 0.6));
      const batch = this.tiles.slice(this.tileIdx, this.tileIdx + this.tilesPerFrame);
      this.runBake(this.full!, batch);
      this.tileIdx += batch.length;
      gl.flush();
    }
    this.lastRender = now;

    // ---- animation (no re-trace needed) ----
    this.azAuto += num(params, "orbitSpeed") * DEG * frame.dt;
    this.discTime += num(params, "discSpeed") * frame.dt;
    const rin = bool(params, "autoInner") ? iscoRadius(a, sense as 1 | -1) : num(params, "rin");
    const rout = Math.max(rin + 0.5, num(params, "rout"));

    // ---- display ----
    const skyTex = this.engine.skyTex;
    bindFBO(this.engine.ctx, this.engine.post.hdr);
    const f = this.full!, p = this.preview!;
    const d = this.display.use();
    d.tex("uDir", 0, f.textures[0]).tex("uHit0", 1, f.textures[1]).tex("uHit1", 2, f.textures[2]).tex("uHit2", 3, f.textures[3])
      .tex("uPDir", 4, p.textures[0]).tex("uPHit0", 5, p.textures[1]).tex("uPHit1", 6, p.textures[2]).tex("uPHit2", 7, p.textures[3])
      .tex("uSky", 8, skyTex, gl.TEXTURE_CUBE_MAP)
      .tex("uDiscTex", 9, this.discTex)
      .tex("uNoise", 12, this.noiseTex);
    this.engine.bindSpectrum(d, 10);
    const skyMode = str(params, "skyMode");
    d.set({
      uRes: [W, H],
      uAzimuth: num(params, "azimuth") * DEG + this.azAuto,
      uDiscTime: this.discTime,
      uClouds: num(params, "clouds"),
      uCoverage: num(params, "coverage"),
      uClumpSize: num(params, "clumpSize"),
      uConcentration: num(params, "concentration"),
      uA: a,
      uDiscSense: sense,
      uRin: rin,
      uRout: rout,
      uTemp: num(params, "temperature"),
      uDoppler: num(params, "doppler"),
      uDiscGain: num(params, "discGain"),
      uOpacity: num(params, "opacity"),
      uColorMode: str(params, "colorMode") === "cinematic" ? 1 : 0,
      uShowDisc: bool(params, "showDisc") ? 1 : 0,
      uShowSky: skyMode !== "none" && (skyTex || skyMode === "grid") ? 1 : 0,
      uSkyMode: skyMode === "grid" ? 1 : 0,
      uSkyGain: num(params, "skyGain"),
      uSkyRot: skyRotation(num(params, "skyYaw"), num(params, "skyTilt")),
    });
    d.draw();
  }

  onDrag(dx: number, dy: number, p: Params) {
    return {
      azimuth: (((num(p, "azimuth") - dx * 120) % 360) + 360) % 360,
      inclination: Math.max(-85, Math.min(85, num(p, "inclination") + dy * 90)),
    };
  }

  onWheel(deltaY: number, p: Params) {
    return { distance: Math.max(4, Math.min(60, num(p, "distance") * Math.exp(deltaY * 0.001))) };
  }

  hud(p: Params): HudItem[] {
    const a = num(p, "spin");
    const s = str(p, "discDir") === "retro" ? -1 : 1;
    return [
      { label: this.text.horizon, value: `${horizonRadius(a).toFixed(3)} M` },
      { label: this.text.isco(s > 0), value: `${iscoRadius(a, s as 1 | -1).toFixed(3)} M` },
      { label: this.text.photonOrbit, value: `${photonOrbitRadius(a, s as 1 | -1).toFixed(3)} M` },
      { label: this.text.horizonSpin, value: `${horizonOmega(a).toFixed(4)} c³/GM` },
      { label: this.text.cameraClock, value: this.text.cameraClockValue(this.camLapse.toFixed(4)) },
    ];
  }

  status(): SimStatus | null {
    const n = this.tiles.length;
    if (!n) return null;
    const progress = this.tileIdx / n;
    return { progress, label: progress < 1 ? this.text.tracing((progress * 100).toFixed(0)) : this.text.traced };
  }

  dispose() {
    const ctx = this.engine.ctx;
    deleteFBO(ctx, this.full);
    deleteFBO(ctx, this.preview);
    this.bake.dispose();
    this.display.dispose();
    ctx.gl.deleteTexture(this.discTex);
    ctx.gl.deleteTexture(this.noiseTex);
  }
}

export const blackholeSim: SimulationDescriptor = {
  id: "blackhole",
  title: "Black Hole",
  tagline: "Gargantua: a spinning black hole with a thin accretion disc",
  description:
    "Null geodesics are integrated through the curved spacetime of a spinning black hole (RK4 on Hamilton's equations) and cached in a 4K ray map. The differentially rotating disc (Interstellar-style concentric lanes and streaks of gas, each on its own Keplerian orbit, denser towards the hole) shows Doppler and gravitational shifts with relativistic beaming, in a cinematic or full blackbody colour model.",
  controlsHelp: "Drag: orbit (horizontal = azimuth, vertical = inclination) · Wheel or pinch: distance",
  params: [
    { key: "spin", label: "Spin a/M (rotation)", group: "Black hole", kind: "range", default: 0.215, min: 0, max: 0.998, step: 0.001, digits: 3, retrace: true, hint: "0 = Schwarzschild (no rotation), 0.998 = Thorne limit" },
    {
      key: "discDir", label: "Disc orbit", group: "Black hole", kind: "select", default: "pro", retrace: true,
      options: [{ value: "pro", label: "Prograde (with spin)" }, { value: "retro", label: "Retrograde (against spin)" }],
    },
    { key: "distance", label: "Distance", group: "Camera", kind: "range", default: 31.8, min: 4, max: 60, step: 0.1, unit: "M", digits: 1, retrace: true },
    { key: "inclination", label: "Inclination", group: "Camera", kind: "range", default: 5, min: -85, max: 85, step: 0.1, unit: "°", digits: 1, retrace: true, hint: "Height above the disc plane" },
    { key: "fov", label: "Field of view", group: "Camera", kind: "range", default: 55, min: 15, max: 120, step: 0.5, unit: "°", digits: 1, retrace: true },
    { key: "azimuth", label: "Azimuth", group: "Camera", kind: "range", default: 0, min: 0, max: 360, step: 0.1, unit: "°", digits: 1, hint: "Free thanks to axisymmetry, no re-trace" },
    { key: "orbitSpeed", label: "Auto orbit", group: "Camera", kind: "range", default: 1, min: -20, max: 20, step: 0.1, unit: "°/s", digits: 1 },
    { key: "showDisc", label: "Accretion disc", group: "Disc", kind: "toggle", default: true },
    { key: "autoInner", label: "Inner edge at ISCO", group: "Disc", kind: "toggle", default: false },
    { key: "rin", label: "Inner radius", group: "Disc", kind: "range", default: 3.6, min: 1, max: 15, step: 0.05, unit: "M", digits: 2, visibleIf: (p) => !p.autoInner },
    { key: "rout", label: "Outer radius", group: "Disc", kind: "range", default: 14, min: 3, max: 40, step: 0.1, unit: "M", digits: 1 },
    { key: "discSpeed", label: "Disc rotation speed", group: "Disc", kind: "range", default: 21, min: 0, max: 200, step: 0.5, unit: "M/s", digits: 1, hint: "Gravitational time units per second; inner orbits are faster (Keplerian)" },
    { key: "temperature", label: "Peak temperature", group: "Disc", kind: "range", default: 3950, min: 1500, max: 40000, step: 50, unit: "K", digits: 0 },
    { key: "doppler", label: "Doppler & gravitational shift", group: "Disc", kind: "range", default: 1, min: 0, max: 1, step: 0.01, digits: 2, hint: "1 = physical strength, 0 = no Doppler (Interstellar's artistic choice)" },
    {
      key: "colorMode", label: "Colour model", group: "Disc", kind: "select", default: "cinematic",
      options: [{ value: "cinematic", label: "Cinematic (fixed hue, beaming)" }, { value: "physical", label: "Blackbody (full Doppler colour)" }],
      hint: "Physical: the receding side reddens and can fade to black at high spin. Raise the temperature to keep it visible.",
    },
    { key: "discGain", label: "Disc brightness", group: "Disc", kind: "range", default: 6, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "opacity", label: "Disc opacity", group: "Disc", kind: "range", default: 0.9, min: 0, max: 1, step: 0.01, digits: 2 },
    { key: "clouds", label: "Gas structure", group: "Gas", kind: "range", default: 0.86, min: 0, max: 1, step: 0.01, digits: 2, hint: "0 = plain fine streaks, 1 = concentric lanes with streaks of gas sliding along them" },
    { key: "clumpSize", label: "Streak size", group: "Gas", kind: "range", default: 1.2, min: 0.4, max: 3, step: 0.05, digits: 2, hint: "Width of the lanes and streaks" },
    { key: "coverage", label: "Streak density", group: "Gas", kind: "range", default: 0.66, min: 0, max: 1, step: 0.01, digits: 2, hint: "How many streaks of gas there are; low values leave gaps you can see through" },
    { key: "concentration", label: "Inner concentration", group: "Gas", kind: "range", default: 1, min: 0, max: 1.5, step: 0.01, digits: 2, hint: "How much denser and brighter the gas gets towards the black hole; the outer gas becomes faint wisps" },
    {
      key: "skyMode", label: "Background", group: "Sky", kind: "select", default: "milkyway",
      options: [{ value: "milkyway", label: "Milky Way (NASA)" }, { value: "grid", label: "Lensing grid" }, { value: "none", label: "None" }],
    },
    { key: "skyGain", label: "Sky brightness", group: "Sky", kind: "range", default: 3.05, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "skyYaw", label: "Sky rotation", group: "Sky", kind: "range", default: 0, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
    { key: "skyTilt", label: "Sky tilt", group: "Sky", kind: "range", default: 35, min: -90, max: 90, step: 0.5, unit: "°", digits: 1, hint: "Angle between the Milky Way and the disc plane" },
    {
      key: "quality", label: "Integration accuracy", group: "Quality", kind: "select", default: "standard", retrace: true,
      options: [{ value: "draft", label: "Draft (fast)" }, { value: "standard", label: "Standard" }, { value: "high", label: "High (slow)" }],
    },
  ],
  globalDefaults: { bloom: 0.1 },
  create: (engine, text) => new BlackHole(engine, text.blackhole),
};
