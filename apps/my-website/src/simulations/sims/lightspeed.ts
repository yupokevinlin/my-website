// Near-light-speed travel ("The journey" in the ScienceClic video).
//
// The camera moves with rapidity eta (beta = tanh eta) towards the galactic
// centre. Per pixel, in the ship frame:
//   * Aberration: a photon arriving at angle theta' from the direction of
//     motion left the source at rest-frame angle theta with
//         tan(theta/2) = e^eta tan(theta'/2)      (numerically stable form)
//   * Doppler factor: D = e^eta cos^2(theta'/2) + e^-eta sin^2(theta'/2)
//   * Colour + searchlight: every sky pixel is re-interpreted as a blackbody
//     (temperature fitted from its colour with a precomputed LUT). Because
//     D^3 B_(nu/D)(T) = B_nu(D T), the observed radiance is just the blackbody
//     at temperature D*T: this gives the colour shift and the D^4 beaming.
//     Point sources (the nearby 3D star field) additionally get 1/D^2 from
//     the solid-angle change.
//   * Optional cosmic microwave background (2.725 K) that becomes visible
//     ahead once D*2.725 K reaches the visible range.
// The nearby stars are a procedural 3D field traced with a DDA through a
// lattice in the galactic rest frame, so they stream past with real parallax.

import type { Engine } from "../gl/engine";
import { Program, bindFBO } from "../gl/gl";
import { SKY_GLSL } from "../gl/sky";
import { SPECTRUM_GLSL, blackbodyRGB } from "../gl/spectrum";
import { HudItem, Params, Simulation, SimulationDescriptor, bool, num, str } from "./types";
import { skyRotation, yawPitch } from "./skyrot";

const LY_PER_YEAR_PER_G = 1.0323; // 1 g in ly / yr^2 (c = 1)
const GALACTIC_CENTRE_LY = 26670;

const FS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uRes;
uniform float uZoom;
uniform mat3 uLook;
uniform float uEta;
uniform int uAberration, uDopplerColor, uBeaming;
uniform samplerCube uSky;
uniform int uStars;
uniform ivec3 uCellBase;
uniform vec3 uCellFrac;
uniform float uDensity;
uniform float uStarGain;
uniform int uMaxCells;
uniform float uPixAng;
uniform float uCmb;
uniform float uExposureComp;
${SKY_GLSL}
${SPECTRUM_GLSL}
out vec4 o;

uvec3 pcg3d(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  return v;
}
vec4 hash4(ivec3 c) {
  uvec3 h = pcg3d(uvec3(c) + uvec3(0x9e3779b9u, 0x7f4a7c15u, 0x94d049bbu));
  uvec3 h2 = pcg3d(h ^ uvec3(0x85ebca6bu));
  return vec4(h, h2.x) * (1.0 / 4294967295.0);
}

// Doppler-shift an extended source (radiance) of rest-frame colour c.
// The pixel is modelled as a blackbody of its colour temperature T; the shift
// is applied as a per-channel ratio B(D T) / B(T), so D = 1 is exactly identity.
vec3 shiftRadiance(vec3 c, float D) {
  float Y = luminance(c);
  if (Y <= 1e-12) return vec3(0.0);
  float T = colourTemperature(c);
  vec3 rest = planck(T), obs = planck(T * D);
  float restY = max(luminance(rest), 1e-30), obsY = luminance(obs);
  vec3 shifted = c * obs / max(rest, vec3(0.05 * restY));
  float sY = max(luminance(shifted), 1e-30);
  if (uDopplerColor == 1 && uBeaming == 1) return shifted;
  if (uDopplerColor == 1) return shifted * (Y / sY);
  if (uBeaming == 1) return c * (obsY / restY);
  return c;
}

// Point star of temperature T and flux F (rest frame).
vec3 shiftStar(float T, float F, float D) {
  vec3 rest = planck(T), obs = planck(T * D);
  float restY = max(luminance(rest), 1e-30), obsY = luminance(obs);
  vec3 chroma = uDopplerColor == 1 ? obs / max(obsY, 1e-30) : rest / restY;
  float lum = uBeaming == 1 ? F * obsY / restY / (D * D) : F;
  return chroma * lum;
}

vec3 starfield(vec3 d, float sigmaRest, float D) {
  vec3 p = uCellFrac;
  ivec3 cell = ivec3(0);
  ivec3 stp = ivec3(sign(d));
  vec3 ad = max(abs(d), vec3(1e-9));
  vec3 tDelta = 1.0 / ad;
  vec3 tMax = vec3(d.x > 0.0 ? 1.0 - p.x : p.x, d.y > 0.0 ? 1.0 - p.y : p.y, d.z > 0.0 ? 1.0 - p.z : p.z) * tDelta;
  vec3 col = vec3(0.0);
  float maxDist = float(uMaxCells) * 0.6;
  for (int i = 0; i < 256; i++) {
    if (i >= uMaxCells) break;
    ivec3 gc = cell + uCellBase;
    vec4 h = hash4(gc);
    if (h.w < uDensity) {
      vec3 sp = vec3(cell) + 0.15 + 0.7 * h.xyz;
      vec3 rel = sp - p;
      float along = dot(rel, d);
      if (along > 0.0) {
        float dist = max(length(rel), 0.05);
        float perp = length(rel - along * d);
        float ang = perp / along;
        // stellar population: mostly cool dwarfs, a few hot bright stars
        vec4 h2 = hash4(gc + ivec3(101, 37, 59));
        float T = 2800.0 + 26000.0 * pow(h2.x, 4.0);
        float L = pow(T / 5800.0, 3.5) * (0.3 + h2.y);
        float fade = 1.0 - smoothstep(maxDist * 0.6, maxDist, dist);
        float F = L / (dist * dist) * fade;
        float k = exp(-0.5 * ang * ang / (sigmaRest * sigmaRest)) / (6.2831853 * sigmaRest * sigmaRest);
        col += shiftStar(T, F, D) * k;
      }
    }
    // advance to next cell
    if (tMax.x < tMax.y && tMax.x < tMax.z) { cell.x += stp.x; tMax.x += tDelta.x; }
    else if (tMax.y < tMax.z) { cell.y += stp.y; tMax.y += tDelta.y; }
    else { cell.z += stp.z; tMax.z += tDelta.z; }
  }
  return col;
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.x;
  // ship frame: +x = direction of motion, z up; camera looks along +x by default
  vec3 ds = uLook * normalize(vec3(uZoom, -uv.x, uv.y));
  float ct = clamp(ds.x, -1.0, 1.0);
  float half_ = 0.5 * acos(ct);
  float c2 = cos(half_), s2 = sin(half_);
  float D = exp(uEta) * c2 * c2 + exp(-uEta) * s2 * s2;
  vec3 d = ds;
  float magnify = 1.0;
  if (uAberration == 1) {
    float th = 2.0 * atan(exp(uEta) * tan(half_));
    float sinT = length(ds.yz);
    vec2 perp = sinT > 1e-9 ? ds.yz / sinT : vec2(1.0, 0.0);
    d = vec3(cos(th), sin(th) * perp);
    magnify = D;     // rest-frame angles are D times larger than ship-frame angles
  }
  vec3 col = shiftRadiance(skyColor(uSky, d), D);
  if (uStars == 1) col += starfield(d, uPixAng * 0.75 * magnify, D) * uStarGain;
  if (uCmb > 0.0) col += planck(2.725 * D) * uCmb;
  o = vec4(col * uExposureComp, 1.0);
}`;

const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const SUN_Y = lum(blackbodyRGB(5800));
/** Exposure compensation for the searchlight effect: tracks a Sun-like star seen dead ahead. */
function exposureCompensation(eta: number) {
  const D = Math.min(Math.exp(eta), 1e5);
  return Math.pow(lum(blackbodyRGB(5800 * D)) / SUN_Y, -0.75);
}

function formatSpeed(eta: number) {
  const beta = Math.tanh(eta);
  const oneMinus = 2 / (Math.exp(2 * eta) + 1);
  const gamma = Math.cosh(eta);
  const b = oneMinus < 1e-4 ? `1 − ${oneMinus.toExponential(2)}` : beta.toFixed(4);
  return `${b} c · γ ${gamma < 100 ? gamma.toFixed(2) : gamma.toExponential(2)}`;
}

class LightSpeed implements Simulation {
  private prog: Program;
  private tau = 0; // ship proper time (years)
  private earth = 0; // rest-frame time (years)
  private dist = 0; // rest-frame distance travelled (ly)
  private eta = 0;
  private drive = "";

  constructor(private engine: Engine) {
    this.prog = new Program(engine.ctx, FS);
  }

  render(params: Params, frame: { time: number; dt: number; width: number; height: number }) {
    const gl = this.engine.gl;
    const target = num(params, "speed");
    const drive = str(params, "drive");
    if (drive !== this.drive) {
      this.drive = drive;
      if (drive === "accel") this.eta = 0; // start the 1 g burn from rest
    }
    if (drive === "accel") {
      // constant 1 g proper acceleration: d(eta)/d(tau) = g
      const dTau = frame.dt * num(params, "yearsPerSecond");
      this.eta = Math.min(target, this.eta + LY_PER_YEAR_PER_G * dTau);
    } else {
      this.eta = target;
    }
    const dTau = frame.dt * num(params, "yearsPerSecond");
    this.tau += dTau;
    this.earth += Math.cosh(this.eta) * dTau;
    this.dist += Math.sinh(this.eta) * dTau;

    const cell = num(params, "cellSize");
    const pos = this.dist / cell;
    const base = Math.floor(pos);
    const fov = (num(params, "fov") * Math.PI) / 180;

    bindFBO(this.engine.ctx, this.engine.post.hdr);
    const p = this.prog.use();
    p.tex("uSky", 0, this.engine.skyTex, gl.TEXTURE_CUBE_MAP);
    this.engine.bindSpectrum(p, 1);
    p.set({
      uRes: [frame.width, frame.height],
      uZoom: 1 / Math.tan(fov / 2),
      uLook: yawPitch(num(params, "yaw"), -num(params, "pitch")),
      uEta: this.eta,
      uAberration: bool(params, "aberration"),
      uDopplerColor: bool(params, "dopplerColor"),
      uBeaming: bool(params, "beaming"),
      uStars: bool(params, "nearStars"),
      uCellBase: new Int32Array([base, 0, 0]),
      uCellFrac: [pos - base, 0.5, 0.5],
      uDensity: num(params, "density"),
      uStarGain: num(params, "starGain") * 1e-4,
      uMaxCells: num(params, "maxCells"),
      uPixAng: (2 * Math.tan(fov / 2)) / frame.width,
      uExposureComp: bool(params, "autoExposure") && bool(params, "beaming") ? exposureCompensation(this.eta) : 1,
      uCmb: bool(params, "cmb") ? Math.pow(10, num(params, "cmbLog")) : 0,
      uSkyMode: str(params, "skyMode") === "grid" ? 1 : 0,
      uSkyGain: str(params, "skyMode") === "none" ? 0 : num(params, "skyGain"),
      uSkyRot: skyRotation(0, 0),
    });
    p.draw();
  }

  onDrag(dx: number, dy: number, p: Params) {
    return {
      yaw: Math.max(-180, Math.min(180, num(p, "yaw") - dx * 90)),
      pitch: Math.max(-89, Math.min(89, num(p, "pitch") - dy * 90)),
    };
  }

  onWheel(deltaY: number, p: Params) {
    return { speed: Math.max(0, Math.min(10, num(p, "speed") - deltaY * 0.001)) };
  }

  hud(): HudItem[] {
    const eta = this.eta;
    const fwd = Math.exp(eta), back = Math.exp(-eta);
    const remaining = GALACTIC_CENTRE_LY - this.dist;
    const yr = (y: number) => (y < 1e4 ? `${y.toFixed(2)} yr` : `${y.toExponential(3)} yr`);
    return [
      { label: "Speed", value: formatSpeed(eta) },
      { label: "Doppler ahead / behind", value: `${fwd < 1e3 ? fwd.toFixed(2) : fwd.toExponential(2)}× / ${back.toPrecision(3)}×` },
      { label: "Ship (proper) time", value: yr(this.tau) },
      { label: "Galaxy (Earth) time", value: yr(this.earth) },
      { label: "Distance travelled", value: `${this.dist < 1e4 ? this.dist.toFixed(2) : this.dist.toExponential(3)} ly` },
      { label: "To galactic centre", value: remaining > 0 ? `${remaining.toFixed(0)} ly` : "Passed!" },
    ];
  }

  dispose() {
    this.prog.dispose();
  }
}

export const lightspeedSim: SimulationDescriptor = {
  id: "lightspeed",
  title: "Near Light Speed",
  tagline: "Travel towards the galactic centre at relativistic speed",
  description:
    "Exact special-relativistic rendering: aberration bunches the sky forward, Doppler shifts every star's blackbody spectrum, and relativistic beaming (the searchlight effect) brightens the view ahead while darkening the sky behind.",
  controlsHelp: "Drag: look around · Wheel or pinch: change speed",
  params: [
    { key: "speed", label: "Speed", group: "Ship", kind: "range", default: 1.5, min: 0, max: 10, step: 0.001, digits: 3, format: formatSpeed, hint: "Rapidity η: β = tanh η, γ = cosh η. Equal steps feel like equal pushes of the engine." },
    {
      key: "drive", label: "Drive", group: "Ship", kind: "select", default: "cruise",
      options: [{ value: "cruise", label: "Cruise at set speed" }, { value: "accel", label: "Accelerate at 1 g up to set speed" }],
    },
    { key: "yearsPerSecond", label: "Ship time per second", group: "Ship", kind: "range", default: 1, min: 0, max: 50, step: 0.01, unit: "yr/s", digits: 2 },
    { key: "fov", label: "Field of view", group: "Camera", kind: "range", default: 90, min: 20, max: 160, step: 0.5, unit: "°", digits: 1 },
    { key: "yaw", label: "Look yaw", group: "Camera", kind: "range", default: 0, min: -180, max: 180, step: 0.1, unit: "°", digits: 1, hint: "0° = straight ahead, 180° = looking back" },
    { key: "pitch", label: "Look pitch", group: "Camera", kind: "range", default: 0, min: -89, max: 89, step: 0.1, unit: "°", digits: 1 },
    { key: "aberration", label: "Aberration", group: "Relativity", kind: "toggle", default: true },
    { key: "dopplerColor", label: "Doppler colour shift", group: "Relativity", kind: "toggle", default: true },
    { key: "beaming", label: "Relativistic beaming", group: "Relativity", kind: "toggle", default: true, hint: "Searchlight effect: brightness scales with the Doppler factor" },
    { key: "autoExposure", label: "Adapt exposure to speed", group: "Relativity", kind: "toggle", default: true, hint: "Like an eye adapting to the brightening view ahead" },
    { key: "cmb", label: "Cosmic microwave background", group: "Relativity", kind: "toggle", default: false, hint: "Becomes visible ahead at extreme speeds (D > ~300)" },
    { key: "cmbLog", label: "CMB brightness (log₁₀)", group: "Relativity", kind: "range", default: -6, min: -14, max: 0, step: 0.1, digits: 1, visibleIf: (p) => !!p.cmb },
    { key: "nearStars", label: "Nearby 3D stars", group: "Stars", kind: "toggle", default: true },
    { key: "density", label: "Star density", group: "Stars", kind: "range", default: 0.2, min: 0.01, max: 1, step: 0.01, digits: 2, visibleIf: (p) => !!p.nearStars },
    { key: "cellSize", label: "Star spacing", group: "Stars", kind: "range", default: 3, min: 0.5, max: 50, step: 0.1, unit: "ly", digits: 1, visibleIf: (p) => !!p.nearStars },
    { key: "starGain", label: "Nearby star brightness", group: "Stars", kind: "range", default: 1, min: 0, max: 20, step: 0.05, digits: 2, visibleIf: (p) => !!p.nearStars },
    { key: "maxCells", label: "Star draw distance", group: "Stars", kind: "range", default: 64, min: 8, max: 256, step: 1, unit: "cells", digits: 0, visibleIf: (p) => !!p.nearStars },
    {
      key: "skyMode", label: "Background", group: "Sky", kind: "select", default: "milkyway",
      options: [{ value: "milkyway", label: "Milky Way (NASA)" }, { value: "grid", label: "Aberration grid" }, { value: "none", label: "None" }],
    },
    { key: "skyGain", label: "Sky brightness", group: "Sky", kind: "range", default: 4, min: 0, max: 20, step: 0.05, digits: 2 },
  ],
  create: (engine) => new LightSpeed(engine),
};
