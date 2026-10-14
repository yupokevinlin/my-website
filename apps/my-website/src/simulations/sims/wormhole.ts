// Interstellar wormhole (Ellis-type "Dneg" wormhole from James, von Tunzelmann,
// Franklin & Thorne 2015, arXiv:1502.03809), ported from aroussel's
// "Interstellar video - Wormhole" Shadertoy.
//
// Metric: ds^2 = -dt^2 + dl^2 + r(l)^2 dOmega^2, throat radius rho = 1,
//   r(l) = rho + M (x atan x - ln(1 + x^2) / 2),  x = 2 (|l| - a) / (pi M)  for |l| > a.
//
// Preprocessing: the spacetime is spherically symmetric, so the fate of a ray
// depends only on the camera position l and the ray's angle to the radial
// direction. We integrate every ray once into a 2D lookup table
// (angle x camera distance -> total deflection psi, exit universe).
// The display pass is then a texture lookup per pixel, so the camera can fly
// through the wormhole and look around at 4K / 60 fps. Only changing the
// wormhole shape (a, M) re-bakes the table (progressively, in strips).

import type { Engine } from "../gl/engine";
import { FBO, Program, bindFBO, createFBO, deleteFBO } from "../gl/gl";
import { SKY_GLSL } from "../gl/sky";
import { DEG, HudItem, Params, Simulation, SimulationDescriptor, SimStatus, bool, num, str } from "./types";
import { skyRotation, yawPitch } from "./skyrot";

const LUT_W = 2048; // ray angle (non-uniform, dense near the throat)
const LUT_H = 512; // camera |l| (quadratic, dense near the throat)
const L_MAX = 30;
const STRIP = 16;

const COMMON = /* glsl */ `
const float PI = 3.14159265358979;
uniform float uThroat;   // a: half-length of the cylindrical throat
uniform float uM;        // lensing (smoothness) parameter
float LtoR(float l) {
  float x = max(0.0, 2.0 * (abs(l) - uThroat) / (PI * uM));
  return 1.0 + uM * (x * atan(x) - 0.5 * log(1.0 + x * x));
}
float LtoDR(float l) {
  float x = max(0.0, 2.0 * (abs(l) - uThroat) / (PI * uM));
  return 2.0 * atan(x) * sign(l) / PI;
}`;

const BAKE_FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uLutRes;
uniform float uLmax;
${COMMON}
out vec4 o;
// state s = (l, phi, dl/dt); b = conserved angular momentum (impact parameter)
vec3 deriv(vec3 s, float b) {
  float r = LtoR(s.x);
  return vec3(s.z, b / (r * r), b * b * LtoDR(s.x) / (r * r * r));
}
void main() {
  vec2 ij = floor(gl_FragCoord.xy);
  float u = ij.x / (uLutRes.x - 1.0);
  float w = ij.y / (uLutRes.y - 1.0);
  float l0 = uLmax * w * w;
  float r0 = LtoR(l0);
  // u in [0, .5]: outward hemisphere, uniform in angle
  // u in [.5, 1]: inward hemisphere, sin(alpha) = t^2 (dense for rays aimed at the throat)
  float ca, sa;
  if (u <= 0.5) { float al = u * PI; ca = cos(al); sa = sin(al); }
  else { float t = (1.0 - u) * 2.0; sa = t * t; ca = -sqrt(max(0.0, 1.0 - sa * sa)); }
  float b = r0 * sa;
  vec3 s = vec3(l0, 0.0, ca);
  float Lfar = max(2.0 * uLmax + uThroat, 2000.0);
  float hNear = clamp(0.25 * uM, 0.004, 0.06);
  float fate = 0.0;
  for (int i = 0; i < 12000; i++) {
    float al = abs(s.x);
    if (al > Lfar) { fate = sign(s.x); break; }
    // rays winding around the throat's unstable photon orbit: after 3 turns
    // their images are sub-pixel rings; stop (black) instead of stalling the warp
    if (abs(s.y) > 6.0 * PI) break;
    float h = hNear + 0.06 * max(al - uThroat, 0.0);
    vec3 k1 = deriv(s, b);
    vec3 k2 = deriv(s + 0.5 * h * k1, b);
    vec3 k3 = deriv(s + 0.5 * h * k2, b);
    vec3 k4 = deriv(s + h * k3, b);
    s += (h / 6.0) * (k1 + 2.0 * (k2 + k3) + k4);
  }
  float r = LtoR(s.x);
  float psi = s.y + atan(b / r, s.z * LtoDR(s.x));
  o = vec4(psi, fate, 0.0, 1.0);
}`;

const DISPLAY_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uLut;
uniform vec2 uLutRes;
uniform float uLmax;
uniform float uCamL;
uniform float uZoom;
uniform mat3 uLook;
uniform vec2 uRes;
uniform samplerCube uSkyA, uSkyB;
uniform mat3 uRotA, uRotB;
uniform float uGainA, uGainB;
uniform int uModeA, uModeB;
${SKY_GLSL}
out vec4 o;
vec4 lut(ivec2 p) { return texelFetch(uLut, clamp(p, ivec2(0), ivec2(uLutRes) - 1), 0); }
void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.x;
  vec3 v = uLook * normalize(vec3(-uZoom, uv));     // frame: x = d/dl, y/z transverse
  float so = uCamL >= 0.0 ? 1.0 : -1.0;
  float vout = v.x * so;                             // component along "away from throat"
  float sa = length(v.yz);
  float u = vout >= 0.0 ? acos(clamp(vout, -1.0, 1.0)) / PI : 1.0 - 0.5 * sqrt(sa);
  float w = sqrt(min(abs(uCamL) / uLmax, 1.0));
  vec2 f = vec2(u * (uLutRes.x - 1.0), w * (uLutRes.y - 1.0));
  ivec2 i0 = ivec2(floor(f));
  vec2 t = f - vec2(i0);
  vec4 a = lut(i0), b = lut(i0 + ivec2(1, 0)), c = lut(i0 + ivec2(0, 1)), d = lut(i0 + ivec2(1, 1));
  vec4 nearest = t.x < 0.5 ? (t.y < 0.5 ? a : c) : (t.y < 0.5 ? b : d);
  float side = nearest.y;
  // bilinear, but never mix rays that end in different universes
  float wa = (1.0 - t.x) * (1.0 - t.y) * float(a.y == side);
  float wb = t.x * (1.0 - t.y) * float(b.y == side);
  float wc = (1.0 - t.x) * t.y * float(c.y == side);
  float wd = t.x * t.y * float(d.y == side);
  float psi = (a.x * wa + b.x * wb + c.x * wc + d.x * wd) / max(wa + wb + wc + wd, 1e-6);
  vec2 beta = sa > 1e-7 ? v.yz / sa : vec2(1.0, 0.0);
  vec3 dir = vec3(cos(psi), sin(psi) * beta);
  bool inA = (side > 0.0) == (uCamL >= 0.0);
  vec3 dA = uRotA * dir, dB = uRotB * dir;
  vec3 cA = texture(uSkyA, dA).rgb, cB = texture(uSkyB, dB).rgb;
  vec3 gA = lensingGrid(dA), gB = lensingGrid(dB);
  vec3 colA = (uModeA == 1 ? gA : cA) * uGainA;
  vec3 colB = (uModeB == 1 ? gB : cB) * uGainB;
  vec3 col = side == 0.0 ? vec3(0.0) : (inA ? colA : colB);
  o = vec4(col, 1.0);
}`;

class Wormhole implements Simulation {
  private bake: Program;
  private display: Program;
  private lut: FBO;
  private lutKey = "";
  private row = LUT_H;
  private lastShapeChange = 0;
  private lastRender = 0;
  private strips = 2;
  private camL = 10;
  private flyPhase = 0;

  constructor(private engine: Engine) {
    const ctx = engine.ctx;
    const gl = ctx.gl;
    this.bake = new Program(ctx, BAKE_FS);
    this.display = new Program(ctx, DISPLAY_FS);
    this.lut = createFBO(ctx, LUT_W, LUT_H, [{ internalFormat: gl.RG32F, format: gl.RG, type: gl.FLOAT }]);
  }

  private cameraL(p: Params, frame: { time: number; dt: number }) {
    const mode = str(p, "travel");
    const L = num(p, "position");
    if (mode === "oscillate") {
      this.flyPhase += frame.dt * num(p, "travelSpeed") * 0.25;
      return Math.abs(L) * Math.cos(this.flyPhase);
    }
    if (mode === "fly") {
      const span = 2 * Math.max(Math.abs(L), 1);
      this.flyPhase = (this.flyPhase + frame.dt * num(p, "travelSpeed")) % span;
      return Math.abs(L) - this.flyPhase;
    }
    return L;
  }

  // Automatic look direction for the travel modes, as a yaw added to the
  // user's: face the throat on approach, turn linearly (in distance) to face
  // its wall by the time it enters, hold that inside, and keep turning on the
  // way out to look back at the wormhole from the far side (0° -> 90° -> 180°,
  // reversed on the way back). The turn never takes the wormhole out of view:
  // the angle away from it is capped by the wormhole's apparent radius
  // asin(rho / r(l)) plus most of the half field of view.
  private autoYaw(p: Params) {
    if (str(p, "travel") === "manual" || !bool(p, "autoTurn")) return 0;
    const a = num(p, "throat");
    const M = num(p, "lensing");
    const m = Math.max(0.05, num(p, "turnStart"));
    const l = this.camL;
    const d = Math.abs(l) - a; // distance outside the mouth
    if (d <= 0) return 90;
    const away = 90 * Math.min(1, Math.max(0, 1 - d / m)); // degrees turned away from the wormhole
    const x = (2 * d) / (Math.PI * M);
    const r = 1 + M * (x * Math.atan(x) - 0.5 * Math.log(1 + x * x));
    const apparent = Math.asin(Math.min(1, 1 / r)) / DEG;
    const halfFov = num(p, "fov") / 2;
    const capped = Math.min(away, apparent + halfFov - 15); // keep at least 15° of it on screen
    return l > 0 ? capped : 180 - capped;
  }

  render(params: Params, frame: { time: number; dt: number; width: number; height: number }) {
    const gl = this.engine.gl;
    const ctx = this.engine.ctx;
    const shape = { uThroat: num(params, "throat"), uM: num(params, "lensing") };
    const key = `${shape.uThroat}|${shape.uM}`;
    const now = performance.now();
    if (key !== this.lutKey) {
      this.lutKey = key;
      this.row = 0;
      this.lastShapeChange = now;
    }
    // progressive LUT bake in horizontal strips; while dragging a slider, only
    // re-bake the rows the camera is currently using so feedback stays live.
    if (this.row < LUT_H) {
      bindFBO(ctx, this.lut);
      this.bake.use().set({ ...shape, uLutRes: [LUT_W, LUT_H], uLmax: L_MAX });
      gl.enable(gl.SCISSOR_TEST);
      if (now - this.lastShapeChange < 150) {
        const camRow = Math.round(Math.sqrt(Math.min(Math.abs(this.camL) / L_MAX, 1)) * (LUT_H - 1));
        gl.scissor(0, Math.max(0, camRow - 2), LUT_W, 5);
        this.bake.draw();
      } else {
        const frameMs = now - this.lastRender;
        if (frameMs < 24) this.strips = Math.min(this.strips + 1, 32);
        else if (frameMs > 45) this.strips = Math.max(1, Math.floor(this.strips * 0.6));
        for (let s = 0; s < this.strips && this.row < LUT_H; s++) {
          gl.scissor(0, this.row, LUT_W, STRIP);
          this.bake.draw();
          this.row += STRIP;
        }
      }
      gl.disable(gl.SCISSOR_TEST);
      gl.flush();
    }
    this.lastRender = now;

    this.camL = this.cameraL(params, frame);
    const skyMilky = this.engine.skyTex;
    const alien = this.engine.sky.alien();
    const pick = (k: string) => (str(params, k) === "alien" ? alien : skyMilky ?? alien);

    bindFBO(ctx, this.engine.post.hdr);
    const d = this.display.use();
    d.tex("uLut", 0, this.lut.textures[0])
      .tex("uSkyA", 1, pick("skyA"), gl.TEXTURE_CUBE_MAP)
      .tex("uSkyB", 2, pick("skyB"), gl.TEXTURE_CUBE_MAP);
    d.set({
      ...shape,
      uLutRes: [LUT_W, LUT_H],
      uLmax: L_MAX,
      uCamL: this.camL,
      uZoom: 1 / Math.tan((num(params, "fov") * DEG) / 2),
      uLook: yawPitch(num(params, "yaw") + this.autoYaw(params), num(params, "pitch")),
      uRes: [frame.width, frame.height],
      uRotA: skyRotation(num(params, "skyYawA"), 0),
      uRotB: skyRotation(num(params, "skyYawB"), 30),
      uGainA: num(params, "gainA"),
      uGainB: num(params, "gainB"),
      uModeA: str(params, "skyA") === "grid" ? 1 : 0,
      uModeB: str(params, "skyB") === "grid" ? 1 : 0,
    });
    d.draw();
  }

  onDrag(dx: number, dy: number, p: Params) {
    return {
      yaw: Math.max(-180, Math.min(180, num(p, "yaw") + dx * 90)),
      pitch: Math.max(-89, Math.min(89, num(p, "pitch") - dy * 90)),
    };
  }

  onWheel(deltaY: number, p: Params) {
    return { position: Math.max(-25, Math.min(25, num(p, "position") + deltaY * 0.005)) };
  }

  hud(p: Params): HudItem[] {
    const a = num(p, "throat"), M = num(p, "lensing");
    const l = this.camL;
    const x = Math.max(0, (2 * (Math.abs(l) - a)) / (Math.PI * M));
    const r = 1 + M * (x * Math.atan(x) - 0.5 * Math.log(1 + x * x));
    return [
      { label: "Camera l", value: `${l.toFixed(2)} ρ` },
      { label: "Circumferential radius r(l)", value: `${r.toFixed(3)} ρ` },
      { label: "Universe", value: Math.abs(l) <= a ? "Inside the throat" : l > 0 ? "Home (Milky Way side)" : "Far side" },
      { label: "Lensing width W", value: `${(1.42953 * M).toFixed(3)} ρ` },
      { label: "Throat length 2a", value: `${(2 * a).toFixed(2)} ρ` },
    ];
  }

  status(): SimStatus | null {
    const progress = Math.min(1, this.row / LUT_H);
    return { progress, label: progress < 1 ? `Integrating geodesic table ${(progress * 100).toFixed(0)}%` : "Geodesic table ready" };
  }

  dispose() {
    deleteFBO(this.engine.ctx, this.lut);
    this.bake.dispose();
    this.display.dispose();
  }
}

export const wormholeSim: SimulationDescriptor = {
  id: "wormhole",
  title: "Wormhole",
  tagline: "Fly through the Interstellar wormhole into another galaxy",
  description:
    "The Ellis/Dneg wormhole used for Interstellar. Because it is spherically symmetric, every light ray is pre-integrated into a 2048×512 geodesic table, so flying through the throat and looking around is a texture lookup per pixel.",
  controlsHelp: "Drag: look around · Wheel: move along the wormhole (manual mode)",
  params: [
    { key: "throat", label: "Throat length a", group: "Wormhole", kind: "range", default: 1, min: 0, max: 5, step: 0.01, unit: "ρ", digits: 2, retrace: true, hint: "Half-length of the cylindrical interior, in units of the throat radius ρ" },
    { key: "lensing", label: "Lensing parameter M", group: "Wormhole", kind: "range", default: 0.15, min: 0.01, max: 2, step: 0.005, unit: "ρ", digits: 3, retrace: true, hint: "Larger M = smoother mouth and wider gravitational lensing" },
    {
      key: "travel", label: "Camera motion", group: "Camera", kind: "select", default: "oscillate",
      options: [{ value: "manual", label: "Manual" }, { value: "oscillate", label: "Oscillate through" }, { value: "fly", label: "Fly through (loop)" }],
    },
    { key: "position", label: "Distance l (manual) / range", group: "Camera", kind: "range", default: 6, min: -25, max: 25, step: 0.01, unit: "ρ", digits: 2 },
    { key: "travelSpeed", label: "Travel speed", group: "Camera", kind: "range", default: 1, min: 0, max: 5, step: 0.01, unit: "ρ/s", digits: 2, visibleIf: (p) => p.travel !== "manual" },
    { key: "autoTurn", label: "Auto-turn camera", group: "Camera", kind: "toggle", default: true, visibleIf: (p) => p.travel !== "manual", hint: "Turn to face the throat wall inside the wormhole, then look back at it from the other side" },
    { key: "turnStart", label: "Turn distance", group: "Camera", kind: "range", default: 3, min: 0.5, max: 8, step: 0.05, unit: "ρ", digits: 2, visibleIf: (p) => p.travel !== "manual" && Boolean(p.autoTurn), hint: "How far from the mouth the camera starts turning; it faces the throat wall as it enters. The wormhole always stays in view." },
    { key: "fov", label: "Field of view", group: "Camera", kind: "range", default: 70, min: 20, max: 140, step: 0.5, unit: "°", digits: 1 },
    { key: "yaw", label: "Look yaw", group: "Camera", kind: "range", default: 0, min: -180, max: 180, step: 0.1, unit: "°", digits: 1 },
    { key: "pitch", label: "Look pitch", group: "Camera", kind: "range", default: 0, min: -89, max: 89, step: 0.1, unit: "°", digits: 1 },
    {
      key: "skyA", label: "Home side sky", group: "Skies", kind: "select", default: "milkyway",
      options: [{ value: "milkyway", label: "Milky Way (NASA)" }, { value: "alien", label: "Nebula galaxy" }, { value: "grid", label: "Lensing grid" }],
    },
    {
      key: "skyB", label: "Far side sky", group: "Skies", kind: "select", default: "alien",
      options: [{ value: "alien", label: "Nebula galaxy" }, { value: "milkyway", label: "Milky Way (NASA)" }, { value: "grid", label: "Lensing grid" }],
    },
    { key: "gainA", label: "Home sky brightness", group: "Skies", kind: "range", default: 5, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "gainB", label: "Far sky brightness", group: "Skies", kind: "range", default: 1.2, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "skyYawA", label: "Home sky rotation", group: "Skies", kind: "range", default: 180, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
    { key: "skyYawB", label: "Far sky rotation", group: "Skies", kind: "range", default: 0, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
  ],
  create: (engine) => new Wormhole(engine),
};
