// Falling into a black hole, after Andrew Hamilton's "Journey into a
// Schwarzschild black hole". Non-spinning hole, units G = c = M = 1.
//
// The camera falls straight in from rest at infinity (the "rain" frame of the
// river model, i.e. Gullstrand-Painlevé coordinates), or hovers on rockets.
// In the rain frame, a photon seen in direction n (n_r = component pointing
// away from the hole) has, per unit of locally measured energy, Killing energy
//     E = 1 + v n_r ,   v = sqrt(2M / r) (the infall speed)
// and impact parameter b = r n_perp / |E|. Its frequency is shifted by
// D = 1 / |E|, which already combines the gravitational shift and the Doppler
// shift of the fall. Inside the horizon, photons with E < 0 can only come from
// the "other universe" of the eternal (Kruskal) black hole; a real hole, formed
// by a collapsing star, has no other universe, so they are black.
//
// Preprocessing: the hole is spherically symmetric, so a ray's fate depends
// only on the camera radius and the ray's angle to the vertical. Every ray is
// integrated once (RK4 on the orbit equations) into a 4096 x 512 table of
// total deflection and fate (our sky, black, or the other universe). The
// table never changes, so falling and looking around are a lookup per pixel.

import type { Engine } from "../gl/engine";
import { FBO, Program, bindFBO, createFBO, deleteFBO } from "../gl/gl";
import { SKY_GLSL } from "../gl/sky";
import { SPECTRUM_GLSL, blackbodyRGB } from "../gl/spectrum";
import { DOPPLER_GLSL } from "../gl/doppler";
import { DEG, HudItem, Params, Simulation, SimulationDescriptor, SimStatus, bool, num, str } from "./types";
import { skyRotation } from "./skyrot";

const LUT_W = 4096; // ray angle from straight up, uniform in [0, pi]
const LUT_H = 512; // camera radius, logarithmic in [R_MIN, R_MAX]
const R_MIN = 0.05;
const R_MAX = 100;
const STRIP = 8;
const R_END = 0.1; // the fall stops (and restarts) here
const HOVER_MIN = 2.02; // nothing can hover at or inside the horizon
const B_CRIT = Math.sqrt(27); // critical impact parameter: the edge of the shadow

const BAKE_FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uLutRes;
uniform float uRmin, uRmax;
out vec4 o;
const float PI = 3.14159265358979;
// state s = (r, phi, dr/dlambda), with the energy scaled to 1
vec3 deriv(vec3 s, float b) {
  float ir = 1.0 / s.x;
  float ir2 = ir * ir;
  return vec3(s.z, b * ir2, b * b * (s.x - 3.0) * ir2 * ir2);
}
void main() {
  vec2 ij = floor(gl_FragCoord.xy);
  float alpha = ij.x / (uLutRes.x - 1.0) * PI;
  float r0 = uRmin * pow(uRmax / uRmin, ij.y / (uLutRes.y - 1.0));
  float v = sqrt(2.0 / r0);
  float nr = cos(alpha), nt = sin(alpha);
  float e = 1.0 + v * nr;                     // Killing energy per unit local energy
  if (abs(e) < 1e-6) { o = vec4(0.0); return; }
  float side = sign(e);                       // +1: our universe, -1: the other one
  float b = r0 * nt / abs(e);
  // traced backwards in time: the ray moves away from the hole when v + n_r > 0
  vec3 s = vec3(r0, 0.0, (v + nr) / abs(e));
  float rFar = max(1000.0, 50.0 * r0);
  float fate = 0.0;
  for (int i = 0; i < 20000; i++) {
    float r = s.x;
    if (r > rFar) { fate = side; break; }
    if (s.z < 0.0 && r < 2.0) break;          // back through the horizon: the collapsed star (black)
    if (s.y > 6.0 * PI) break;                // winding around the photon sphere: sub-pixel rings
    float h = 0.02 * min(r / max(abs(s.z), 1e-3), r * r / max(b, 1e-6));
    h = clamp(h, 1e-5, 0.05 * r);
    vec3 k1 = deriv(s, b);
    vec3 k2 = deriv(s + 0.5 * h * k1, b);
    vec3 k3 = deriv(s + 0.5 * h * k2, b);
    vec3 k4 = deriv(s + h * k3, b);
    s += (h / 6.0) * (k1 + 2.0 * (k2 + k3) + k4);
  }
  // direction the light finally came from: the orbit angle plus the ray's tilt
  float psi = s.y + atan(b / s.x, s.z);
  o = vec4(psi, fate, 0.0, 1.0);
}`;

const DISPLAY_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uLut;
uniform vec2 uLutRes;
uniform float uLogRmin, uLogSpan;
uniform float uR;
uniform int uHover;
uniform float uZoom;
uniform mat3 uLook;
uniform vec2 uRes;
uniform samplerCube uSkyA, uSkyB;
uniform mat3 uRotA, uRotB;
uniform float uGainA, uGainB;
uniform int uModeA;
uniform int uOther;
uniform int uDopplerColor, uBeaming;
uniform float uExposureComp;
${SKY_GLSL}
${SPECTRUM_GLSL}
${DOPPLER_GLSL}
out vec4 o;
vec4 lut(ivec2 p) { return texelFetch(uLut, clamp(p, ivec2(0), ivec2(uLutRes) - 1), 0); }
void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.x;
  vec3 d = uLook * normalize(vec3(-uZoom, uv));     // frame: x = straight up, away from the hole
  float v = sqrt(2.0 / uR);
  float D;
  if (uHover == 1) {
    // a hovering observer sees the falling observer's sky aberrated: the
    // faller moves down (-x) at speed v past it
    float cs = -d.x;
    float cr = (cs + v) / (1.0 + v * cs);
    float tl = length(d.yz);
    vec2 bt = tl > 1e-7 ? d.yz / tl : vec2(1.0, 0.0);
    d = vec3(-cr, sqrt(max(0.0, 1.0 - cr * cr)) * bt);
    D = inversesqrt(max(1.0 - 2.0 / uR, 1e-6));     // gravitational blueshift only
  } else {
    D = 1.0 / max(abs(1.0 + v * d.x), 1e-6);
  }
  float u = acos(clamp(d.x, -1.0, 1.0)) / PI;
  float w = clamp((log(uR) - uLogRmin) / uLogSpan, 0.0, 1.0);
  vec2 f = vec2(u * (uLutRes.x - 1.0), w * (uLutRes.y - 1.0));
  ivec2 i0 = ivec2(floor(f));
  vec2 t = f - vec2(i0);
  vec4 a = lut(i0), b = lut(i0 + ivec2(1, 0)), c = lut(i0 + ivec2(0, 1)), e = lut(i0 + ivec2(1, 1));
  vec4 nearest = t.x < 0.5 ? (t.y < 0.5 ? a : c) : (t.y < 0.5 ? b : e);
  float side = nearest.y;
  // bilinear, but never mix rays with different fates
  float wa = (1.0 - t.x) * (1.0 - t.y) * float(a.y == side);
  float wb = t.x * (1.0 - t.y) * float(b.y == side);
  float wc = (1.0 - t.x) * t.y * float(c.y == side);
  float wd = t.x * t.y * float(e.y == side);
  float psi = (a.x * wa + b.x * wb + c.x * wc + e.x * wd) / max(wa + wb + wc + wd, 1e-6);
  float sa = length(d.yz);
  vec2 beta = sa > 1e-7 ? d.yz / sa : vec2(1.0, 0.0);
  vec3 dir = vec3(cos(psi), sin(psi) * beta);
  vec3 dA = uRotA * dir, dB = uRotB * dir;
  // sample unconditionally: the derivatives need uniform control flow
  vec3 cA = texture(uSkyA, dA).rgb, cB = texture(uSkyB, dB).rgb;
  vec3 gA = lensingGrid(dA);
  vec3 col = vec3(0.0);
  if (side > 0.5) col = (uModeA == 1 ? gA : cA) * uGainA;
  else if (side < -0.5 && uOther == 1) col = cB * uGainB;
  o = vec4(shiftRadiance(col, D) * uExposureComp, 1.0);
}`;

/** Column-major mat3 Rx(azimuth) * Ry(theta): theta tilts the view from straight down towards straight up. */
function lookMatrix(azDeg: number, thetaDeg: number): Float32Array {
  const ca = Math.cos(azDeg * DEG), sa = Math.sin(azDeg * DEG);
  const ct = Math.cos(thetaDeg * DEG), st = Math.sin(thetaDeg * DEG);
  // row-major: [ct, 0, st; sa*st, ca, -sa*ct; -ca*st, sa, ca*ct]
  return new Float32Array([ct, sa * st, -ca * st, 0, ca, sa, st, -sa * ct, ca * ct]);
}

/**
 * Angular radius of the black region around straight down, in degrees: the
 * edge is where the impact parameter b equals sqrt(27) M. Outside the photon
 * sphere (r > 3) it lies on the downward branch of b(angle), inside on the
 * upward one.
 */
export function shadowRadius(r: number, hover: boolean): number {
  const v = hover ? 0 : Math.sqrt(2 / r);
  const k = hover ? 1 / Math.sqrt(Math.max(1 - 2 / r, 1e-9)) : 1;
  const b = (a: number) => (r * k * Math.sin(a)) / (1 + v * Math.cos(a));
  const peak = v <= 1 ? Math.acos(-v) : Math.acos(-1 / v);
  let lo = r > 3 ? peak : 0;
  let hi = r > 3 ? Math.PI : peak;
  const rising = r <= 3;
  for (let i = 0; i < 50; i++) {
    const mid = 0.5 * (lo + hi);
    if ((b(mid) < B_CRIT) === rising) lo = mid;
    else hi = mid;
  }
  return 180 - (0.5 * (lo + hi)) / DEG;
}

const MASSES: Record<string, { suns: number; label: string }> = {
  stellar: { suns: 10, label: "10 Suns" },
  sgra: { suns: 4.3e6, label: "Sagittarius A*" },
  gargantua: { suns: 1e8, label: "Gargantua" },
  m87: { suns: 6.5e9, label: "M87*" },
};
const SUN_SECONDS = 4.925491e-6; // GM_sun / c^3
const SUN_METRES = 1476.625; // GM_sun / c^2
const C2 = 8.98755179e16;

function formatDuration(s: number): string {
  if (s < 1e-3) return `${(s * 1e6).toPrecision(3)} µs`;
  if (s < 1) return `${(s * 1e3).toPrecision(3)} ms`;
  if (s < 120) return `${s.toPrecision(3)} s`;
  if (s < 7200) return `${(s / 60).toPrecision(3)} min`;
  if (s < 172800) return `${(s / 3600).toPrecision(3)} h`;
  return `${(s / 86400).toPrecision(3)} days`;
}

function formatG(a: number): string {
  const g = a / 9.81;
  if (g < 0.01) return `${g.toExponential(1)} g`;
  if (g < 1000) return `${g.toPrecision(3)} g`;
  return `${g.toExponential(1)} g`;
}

const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const SUN_Y = lum(blackbodyRGB(5800));

class Infall implements Simulation {
  private bake: Program;
  private display: Program;
  private lut: FBO;
  private strips: number[];
  private stripIdx = 0;
  private stripsPerFrame = 2;
  private lastRender = 0;
  private r = 30;
  private fallR = -1;
  private fallStart = -1;
  private hold = 0;

  constructor(private engine: Engine) {
    const ctx = engine.ctx;
    const gl = ctx.gl;
    this.bake = new Program(ctx, BAKE_FS);
    this.display = new Program(ctx, DISPLAY_FS);
    this.lut = createFBO(ctx, LUT_W, LUT_H, [{ internalFormat: gl.RG32F, format: gl.RG, type: gl.FLOAT }]);
    // bake outwards from the starting radius, so the first view is ready first
    const startRow = this.rowOf(30);
    const rows: number[] = [];
    for (let y = 0; y < LUT_H; y += STRIP) rows.push(y);
    this.strips = rows.sort((a, b) => Math.abs(a + STRIP / 2 - startRow) - Math.abs(b + STRIP / 2 - startRow));
  }

  private rowOf(r: number) {
    return (Math.log(r / R_MIN) / Math.log(R_MAX / R_MIN)) * (LUT_H - 1);
  }

  private cameraRadius(p: Params, dt: number) {
    const set = num(p, "radius");
    if (str(p, "observer") === "hover") return Math.max(set, HOVER_MIN);
    if (str(p, "motion") === "manual") {
      this.fallR = -1;
      return Math.max(set, R_END);
    }
    if (this.fallR < 0 || this.fallStart !== set) {
      this.fallStart = set;
      this.fallR = set;
      this.hold = 0;
    }
    if (this.hold > 0) {
      this.hold -= dt;
      if (this.hold <= 0) this.fallR = set;
      return this.fallR;
    }
    const speed = num(p, "fallSpeed");
    if (str(p, "pacing") === "proper") {
      // r^(3/2) falls linearly with proper time: d(r^1.5)/dtau = -1.5 sqrt(2)
      const x = Math.pow(this.fallR, 1.5) - 1.5 * Math.SQRT2 * 2 * speed * dt;
      this.fallR = x > 0 ? Math.pow(x, 2 / 3) : 0;
    } else {
      this.fallR *= Math.exp(-0.25 * speed * dt);
    }
    if (this.fallR <= R_END) {
      this.fallR = R_END;
      this.hold = 1.5;
    }
    return this.fallR;
  }

  /** Look angle from straight down that keeps the edge of the black region in view. */
  private autoLook(p: Params, aspect: number) {
    if (!bool(p, "autoLook")) return 0;
    const rho = shadowRadius(this.r, str(p, "observer") === "hover");
    const h = Math.atan(Math.tan((num(p, "fov") * DEG) / 2) * aspect) / DEG;
    const theta = Math.min(Math.max(2 * rho - 0.8 * h, 0), rho + 0.3 * h);
    // hovering near the horizon the sky is a small circle overhead: look straight up at it
    const up = Math.min(1, Math.max(0, (1.2 * h - (180 - rho)) / (0.6 * h)));
    return theta + (180 - theta) * up * up * (3 - 2 * up);
  }

  render(params: Params, frame: { time: number; dt: number; width: number; height: number }) {
    const gl = this.engine.gl;
    const ctx = this.engine.ctx;
    const now = performance.now();

    // progressive, one-time table bake in strips
    if (this.stripIdx < this.strips.length) {
      const frameMs = now - this.lastRender;
      if (frameMs < 24) this.stripsPerFrame = Math.min(this.stripsPerFrame + 1, 32);
      else if (frameMs > 45) this.stripsPerFrame = Math.max(1, Math.floor(this.stripsPerFrame * 0.6));
      bindFBO(ctx, this.lut);
      this.bake.use().set({ uLutRes: [LUT_W, LUT_H], uRmin: R_MIN, uRmax: R_MAX });
      gl.enable(gl.SCISSOR_TEST);
      for (let s = 0; s < this.stripsPerFrame && this.stripIdx < this.strips.length; s++) {
        gl.scissor(0, this.strips[this.stripIdx++], LUT_W, STRIP);
        this.bake.draw();
      }
      gl.disable(gl.SCISSOR_TEST);
      gl.flush();
    }
    this.lastRender = now;

    this.r = this.cameraRadius(params, frame.dt);
    const hover = str(params, "observer") === "hover";
    const theta = this.autoLook(params, frame.height / frame.width) + num(params, "pitch");
    const skyMilky = this.engine.skyTex;
    const alien = this.engine.sky.alien();
    const blueshift = hover ? 1 / Math.sqrt(1 - 2 / this.r) : 1;
    const comp = bool(params, "autoExposure") && bool(params, "beaming") && hover
      ? Math.pow(lum(blackbodyRGB(5800 * Math.min(blueshift, 1e4))) / SUN_Y, -0.75)
      : 1;

    bindFBO(ctx, this.engine.post.hdr);
    const d = this.display.use();
    d.tex("uLut", 0, this.lut.textures[0])
      .tex("uSkyA", 1, skyMilky ?? alien, gl.TEXTURE_CUBE_MAP)
      .tex("uSkyB", 2, alien, gl.TEXTURE_CUBE_MAP);
    this.engine.bindSpectrum(d, 3);
    d.set({
      uLutRes: [LUT_W, LUT_H],
      uLogRmin: Math.log(R_MIN),
      uLogSpan: Math.log(R_MAX / R_MIN),
      uR: this.r,
      uHover: hover,
      uZoom: 1 / Math.tan((num(params, "fov") * DEG) / 2),
      uLook: lookMatrix(num(params, "azimuth"), theta),
      uRes: [frame.width, frame.height],
      uRotA: skyRotation(num(params, "skyYaw"), num(params, "skyTilt")),
      uRotB: skyRotation(0, 30),
      uGainA: num(params, "skyGain"),
      uGainB: num(params, "otherGain"),
      uModeA: str(params, "skyMode") === "grid" ? 1 : 0,
      uOther: str(params, "interior") === "eternal",
      uDopplerColor: bool(params, "dopplerColor"),
      uBeaming: bool(params, "beaming"),
      uExposureComp: comp,
      uSkyMode: 0,
      uSkyGain: 1,
      uSkyRot: skyRotation(0, 0),
    });
    d.draw();
  }

  onDrag(dx: number, dy: number, p: Params) {
    return {
      azimuth: (((num(p, "azimuth") - dx * 120) % 360) + 360) % 360,
      pitch: Math.max(-180, Math.min(180, num(p, "pitch") - dy * 90)),
    };
  }

  // wheel and pinch move the camera, taking over from the automatic fall
  onWheel(deltaY: number, p: Params) {
    const from = str(p, "motion") === "manual" || str(p, "observer") === "hover" ? num(p, "radius") : this.r;
    return { motion: "manual", radius: Math.max(R_END, Math.min(60, from * Math.exp(deltaY * 0.001))) };
  }

  hud(p: Params): HudItem[] {
    const r = this.r;
    const mass = MASSES[str(p, "mass")] ?? MASSES.sgra;
    const rg = mass.suns * SUN_METRES; // GM / c^2 in metres
    const tidal = (2 * C2 * 2) / (r * r * r * rg * rg); // across a 2 m body
    const items: HudItem[] = [
      { label: "Radius", value: `${r.toFixed(r < 1 ? 3 : 2)} M · ${(r / 2).toFixed(2)} × horizon` },
      { label: "Where", value: r > 2 ? "Outside the horizon" : "Inside the horizon" },
    ];
    if (str(p, "observer") === "hover") {
      const f = 1 - 2 / r;
      items.push(
        { label: "Rocket thrust to hover", value: formatG(C2 / rg / (r * r * Math.sqrt(f))) },
        { label: "Your clock rate", value: `${Math.sqrt(f).toFixed(4)} × far away` },
      );
    } else {
      const tau = (Math.SQRT2 / 3) * Math.pow(r, 1.5);
      items.push(
        { label: "Speed past hovering observers", value: r > 2 ? `${Math.sqrt(2 / r).toFixed(3)} c` : "none can hover here" },
        { label: "Your time to the singularity", value: formatDuration(tau * mass.suns * SUN_SECONDS) },
      );
    }
    items.push({ label: "Tidal stretch on your body", value: formatG(tidal) });
    return items;
  }

  status(): SimStatus | null {
    const progress = this.stripIdx / this.strips.length;
    return { progress, label: progress < 1 ? `Integrating light paths ${(progress * 100).toFixed(0)}%` : "Light paths ready" };
  }

  dispose() {
    deleteFBO(this.engine.ctx, this.lut);
    this.bake.dispose();
    this.display.dispose();
  }
}

export const infallSim: SimulationDescriptor = {
  id: "infall",
  title: "Falling In",
  tagline: "Fall through the event horizon of a black hole",
  description:
    "Free fall into a non-spinning black hole, in the frame of an observer dropped from far away. The hole is spherically symmetric, so every light ray is pre-integrated into a 4096×512 table of deflection and fate; the colour and brightness of the sky follow from the exact Doppler and gravitational shift of the fall.",
  controlsHelp: "Drag: look around · Wheel or pinch: move closer or farther (stops the fall)",
  params: [
    {
      key: "observer", label: "Observer", group: "Fall", kind: "select", default: "fall",
      options: [{ value: "fall", label: "Falling freely" }, { value: "hover", label: "Hovering on rockets" }],
      hint: "A hovering observer must fire rockets to stay put; nothing can hover at or inside the horizon.",
    },
    {
      key: "motion", label: "Motion", group: "Fall", kind: "select", default: "fall",
      options: [{ value: "fall", label: "Fall in (loop)" }, { value: "manual", label: "Manual" }],
      visibleIf: (p) => p.observer !== "hover",
    },
    { key: "radius", label: "Radius (manual) / starting radius", group: "Fall", kind: "range", default: 30, min: 0.1, max: 60, step: 0.01, unit: "M", digits: 2, hint: "The horizon is at 2 M, the photon sphere at 3 M" },
    {
      key: "pacing", label: "Pacing", group: "Fall", kind: "select", default: "even",
      options: [{ value: "even", label: "Slow down near the hole" }, { value: "proper", label: "Real time (falling clock)" }],
      visibleIf: (p) => p.observer !== "hover" && p.motion !== "manual",
      hint: "Real time: the last stretch, from the horizon to the singularity, takes only 4/3 M of your own time.",
    },
    { key: "fallSpeed", label: "Fall speed", group: "Fall", kind: "range", default: 1, min: 0.05, max: 5, step: 0.01, unit: "×", digits: 2, visibleIf: (p) => p.observer !== "hover" && p.motion !== "manual" },
    {
      key: "mass", label: "Black hole mass", group: "Fall", kind: "select", default: "sgra",
      options: [
        { value: "stellar", label: "10 Suns (stellar)" },
        { value: "sgra", label: "4.3 million Suns (Sagittarius A*)" },
        { value: "gargantua", label: "100 million Suns (Gargantua)" },
        { value: "m87", label: "6.5 billion Suns (M87*)" },
      ],
      hint: "Only changes the real-world times and forces in the readout; the view is the same for any mass.",
    },
    {
      key: "interior", label: "Inside the horizon", group: "Fall", kind: "select", default: "real",
      options: [{ value: "real", label: "Real black hole (formed by a collapsing star)" }, { value: "eternal", label: "Eternal black hole (see the other universe)" }],
      hint: "The idealised, eternal black hole connects to a second universe, which you glimpse below you once inside.",
    },
    { key: "autoLook", label: "Keep the edge in view", group: "Camera", kind: "toggle", default: true, hint: "Turn from facing the hole towards the sky as the black region grows" },
    { key: "fov", label: "Field of view", group: "Camera", kind: "range", default: 90, min: 20, max: 150, step: 0.5, unit: "°", digits: 1 },
    { key: "pitch", label: "Look up / down", group: "Camera", kind: "range", default: 0, min: -180, max: 180, step: 0.1, unit: "°", digits: 1, hint: "Added to the automatic angle; 0° = straight down at the hole when that is off" },
    { key: "azimuth", label: "Turn around", group: "Camera", kind: "range", default: 0, min: 0, max: 360, step: 0.1, unit: "°", digits: 1 },
    { key: "dopplerColor", label: "Doppler colour shift", group: "Light", kind: "toggle", default: true },
    { key: "beaming", label: "Brightness shift", group: "Light", kind: "toggle", default: true, hint: "Blueshifted light is brighter, redshifted light dimmer" },
    { key: "autoExposure", label: "Adapt exposure while hovering", group: "Light", kind: "toggle", default: true, visibleIf: (p) => p.observer === "hover" },
    {
      key: "skyMode", label: "Background", group: "Sky", kind: "select", default: "milkyway",
      options: [{ value: "milkyway", label: "Milky Way (NASA)" }, { value: "grid", label: "Lensing grid" }],
    },
    { key: "skyGain", label: "Sky brightness", group: "Sky", kind: "range", default: 4, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "otherGain", label: "Other universe brightness", group: "Sky", kind: "range", default: 1.2, min: 0, max: 20, step: 0.05, digits: 2, visibleIf: (p) => p.interior === "eternal" },
    { key: "skyYaw", label: "Sky rotation", group: "Sky", kind: "range", default: 40, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
    { key: "skyTilt", label: "Sky tilt", group: "Sky", kind: "range", default: 60, min: -90, max: 90, step: 0.5, unit: "°", digits: 1 },
  ],
  create: (engine) => new Infall(engine),
};
