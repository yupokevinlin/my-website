// Alcubierre warp drive (M. Alcubierre, "The warp drive: hyper-fast travel
// within general relativity", 1994, arXiv:gr-qc/0009013).
//
// Metric: ds^2 = -dt^2 + (dx - v_s f(r_s) dt)^2 + dy^2 + dz^2 with the shape
//   f(r) = [tanh(sigma (r + R)) - tanh(sigma (r - R))] / (2 tanh(sigma R)),
// 1 inside the bubble and 0 outside. In coordinates moving with the bubble,
// xi = x - v_s t, it is stationary:
//   ds^2 = -dt^2 + (dxi + V dt)^2 + dy^2 + dz^2 ,  V = v_s (1 - f),
// so a light ray keeps its energy E = -p_t. Hamilton's equations for
// H = (p^2 - w^2) / 2, with w = E + V p_xi, are
//   dx/dlambda = p - w V x_hat ,  dp/dlambda = w p_xi grad V.
// Cameras are Eulerian (normal) observers: at rest in the bubble at its
// centre, and at rest relative to the stars outside it. They measure a
// photon's energy as w and its direction as p / w, so starlight is shifted by
// D = w_camera / w_far = 1 + v_s s_x for a star in direction s.
//
// Rays are straight outside the wall and in the flat interior, so they jump
// across those analytically and are integrated (RK4) only through the wall.
// The ray map (sky direction, shift, exotic matter glow, ship) is cached and
// re-traced only when the camera or the bubble changes: a quarter-resolution
// preview at once, then full resolution in tiles, as for the black hole.

import type { Engine } from "../gl/engine";
import { FBO, Program, bindFBO, createFBO, deleteFBO } from "../gl/gl";
import { SKY_GLSL } from "../gl/sky";
import { SPECTRUM_GLSL, blackbodyRGB } from "../gl/spectrum";
import { DOPPLER_GLSL, STARFIELD_GLSL } from "../gl/doppler";
import { DEG, HudItem, Params, Simulation, SimulationDescriptor, SimStatus, bool, num, str } from "./types";
import { skyRotation, yawPitch } from "./skyrot";

const GALACTIC_CENTRE_LY = 26670;
// semi-axes of the ship, in bubble radii
const SHIP = [0.36, 0.085, 0.085];

const BAKE_FS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uRes;
uniform vec3 uCamPos;
uniform mat3 uCamBasis;   // columns: forward, right, up
uniform float uZoom;
uniform float uV;         // bubble speed, in c
uniform float uSigma;     // wall sharpness, in 1 / bubble radius
uniform float uTanhS;     // tanh(sigma R), R = 1
uniform int uShip;
layout(location = 0) out vec4 oDir;   // xyz: sky direction (on the ship: reflected direction); w: 1 sky, 0 black, 2 ship
layout(location = 1) out vec4 oInfo;  // x: frequency shift, y: exotic matter glow, z: ship lighting (n.L), w: ship window light

const vec3 LIGHT = normalize(vec3(0.35, 0.55, 0.76));   // a key light on the ship, fixed in the bubble
const vec3 SHIP_A = vec3(${SHIP.map((s) => s.toFixed(3)).join(", ")});
float E;

// tanh, safe from overflow on every GPU
float th(float x) { x = clamp(x, -15.0, 15.0); float e = exp(2.0 * x); return (e - 1.0) / (e + 1.0); }
float shapeF(float r) { return (th(uSigma * (r + 1.0)) - th(uSigma * (r - 1.0))) / (2.0 * uTanhS); }
float shapeDF(float r) {
  float a = th(uSigma * (r + 1.0)), b = th(uSigma * (r - 1.0));
  return uSigma * (b * b - a * a) / (2.0 * uTanhS);
}
void deriv(vec3 X, vec3 p, out vec3 dX, out vec3 dp) {
  float r = max(length(X), 1e-6);
  float V = uV * (1.0 - shapeF(r));
  float w = E + V * p.x;
  dX = p - vec3(w * V, 0.0, 0.0);
  dp = (-w * p.x * uV * shapeDF(r) / r) * X;     // w p_x grad V
}

// ray (origin o, direction d) against the ship, an ellipsoid at the centre
float hitShip(vec3 o, vec3 d) {
  vec3 q = o / SHIP_A, dq = d / SHIP_A;
  float a = dot(dq, dq), b = dot(q, dq), c = dot(q, q) - 1.0;
  float disc = b * b - a * c;
  if (disc < 0.0) return -1.0;
  float s = (-b - sqrt(disc)) / a;
  return s > 0.0 ? s : -1.0;
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.x;
  vec3 view = normalize(uCamBasis * vec3(uZoom, uv));   // where the light comes from
  vec3 X = uCamPos;
  vec3 p = -view;                       // photon momentum, scaled so the camera measures w = 1
  E = 1.0 - uV * (1.0 - shapeF(length(X))) * p.x;
  float rOut = 1.0 + 4.5 / uSigma;      // beyond: V = v_s, rays are straight
  float rIn = max(0.0, 1.0 - 4.5 / uSigma); // inside: V = 0, rays are straight
  float glow = 0.0;
  float fate = 1.0;
  for (int i = 0; i < 700; i++) {
    float r = length(X);
    float V = uV * (1.0 - shapeF(r));
    float w = E + V * p.x;
    // the photon's energy runs away at a horizon of the bubble: no light from there
    if (!(w > 1e-4) || !(dot(p, p) < 1e8)) { fate = 0.0; break; }
    vec3 u = p - vec3(w * V, 0.0, 0.0);  // spatial velocity; we trace backwards, along -u
    if (r >= rOut) {
      float b = dot(X, -u);
      if (b >= 0.0) break;               // heading away from the bubble: escaped
      float a = dot(u, u), c = r * r - rOut * rOut * 0.9996;
      float disc = b * b - a * c;
      if (disc <= 0.0) break;            // misses the bubble
      X -= ((-b - sqrt(disc)) / a) * u;
      continue;
    }
    if (r < rIn || uShip == 1 && r < 0.5) {
      // flat interior (V = 0): straight on, past the ship
      vec3 bd = normalize(-u);
      if (uShip == 1) {
        float s = hitShip(X, bd);
        if (s > 0.0) {
          vec3 H = X + s * bd;
          vec3 n = normalize(H / (SHIP_A * SHIP_A));
          float along = H.x / SHIP_A.x;
          float ang = atan(H.z, H.y);
          // two rows of windows and a ring of lights around the bow
          float win = step(0.55, fract(ang * 3.8197 + 0.25)) * (1.0 - step(0.06, abs(abs(n.z) - 0.55)))
                    * step(-0.55, along) * step(along, 0.45) * step(0.5, fract(along * 9.0));
          float bow = smoothstep(0.03, 0.0, abs(along - 0.62)) * 0.6;
          oDir = vec4(reflect(bd, n), 2.0);
          oInfo = vec4(1.0 / w, glow, dot(n, LIGHT), win + bow);
          return;
        }
      }
      if (rIn > 0.0 && r < rIn) {
        float b = dot(X, bd), c = r * r - rIn * rIn * 1.0004;
        X += (-b + sqrt(max(b * b - c, 0.0))) * bd;
        continue;
      }
    }
    // RK4 through the wall, backwards in time; the spatial step is 0.12 / sigma
    float h = -0.12 / (uSigma * max(length(u), 1e-3));
    vec3 k1x, k1p, k2x, k2p, k3x, k3p, k4x, k4p;
    deriv(X, p, k1x, k1p);
    deriv(X + 0.5 * h * k1x, p + 0.5 * h * k1p, k2x, k2p);
    deriv(X + 0.5 * h * k2x, p + 0.5 * h * k2p, k3x, k3p);
    deriv(X + h * k3x, p + h * k3p, k4x, k4p);
    vec3 nX = X + (h / 6.0) * (k1x + 2.0 * (k2x + k3x) + k4x);
    p += (h / 6.0) * (k1p + 2.0 * (k2p + k3p) + k4p);
    // negative energy density of the wall, rho ~ (y^2 + z^2) / r^2 f'(r)^2:
    // densest in a ring around the direction of travel
    float df = shapeDF(r);
    glow += dot(X.yz, X.yz) / max(r * r, 1e-6) * df * df * length(nX - X) / uSigma;
    X = nX;
    if (i == 699) fate = 0.0;
  }
  float w = E + uV * (1.0 - shapeF(length(X))) * p.x;
  vec3 s = fate > 0.5 ? -p / max(w, 1e-6) : vec3(1.0, 0.0, 0.0);
  oDir = vec4(normalize(s), fate);
  oInfo = vec4(1.0 / max(w, 1e-6), glow, 0.0, 0.0);
}`;

const DISPLAY_FS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uDir, uInfo, uPDir, uPInfo;
uniform samplerCube uSky;
uniform vec2 uRes;
uniform float uV;
uniform int uDopplerColor, uBeaming;
uniform float uExposureComp;
uniform float uGlow;
uniform int uStars;
uniform float uStarGain;
uniform float uPixAng;
${SKY_GLSL}
${SPECTRUM_GLSL}
${DOPPLER_GLSL}
${STARFIELD_GLSL}
out vec4 o;
void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  vec4 d = texelFetch(uDir, ip, 0);
  vec4 info;
  if (d.w < -0.5) {
    // not traced at full resolution yet: use the preview
    vec2 uv = gl_FragCoord.xy / uRes;
    d = texture(uPDir, uv);
    info = texture(uPInfo, uv);
    d.w = floor(d.w + 0.5);
  } else {
    info = texelFetch(uInfo, ip, 0);
  }
  vec3 s = length(d.xyz) > 1e-6 ? normalize(d.xyz) : vec3(1.0, 0.0, 0.0);
  // sample unconditionally: the derivatives need uniform control flow
  vec3 sky = skyColor(uSky, s);
  vec3 env = textureLod(uSky, uSkyRot * s, 5.0).rgb * uSkyGain;
  float pix = clamp(length(fwidth(s)), uPixAng, 8.0 * uPixAng);
  vec3 col = vec3(0.0);
  if (d.w > 0.5 && d.w < 1.5) {
    float D = info.x;
    col = shiftRadiance(sky, D);
    if (uStars == 1) col += starfield(s, pix * 0.75, D) * uStarGain;
  } else if (d.w > 1.5) {
    // the ship: brushed metal under a key light, reflecting the shifted sky,
    // with lit windows; all of it shifted on its way to the camera
    vec3 L = normalize(vec3(0.35, 0.55, 0.76));
    vec3 hull = vec3(0.56, 0.58, 0.62) * (0.05 + 0.95 * max(info.z, 0.0)) * 0.35
              + vec3(1.0, 0.96, 0.9) * pow(max(dot(s, L), 0.0), 60.0) * 1.5
              + vec3(1.0, 0.72, 0.42) * info.w * 0.6;
    col = shiftRadiance(hull, info.x);
    float Dsky = 1.0 + uV * s.x;        // starlight reaching the ship from direction s
    if (Dsky > 0.0) col += shiftRadiance(env * 0.4, Dsky * info.x);
  }
  // the energy needed grows as v^2; the glow stops growing at 1 c so it never floods the view
  col += vec3(0.55, 0.3, 1.0) * info.y * uGlow * min(uV * uV, 1.0);
  o = vec4(col * uExposureComp, 1.0);
}`;

interface Tile { x: number; y: number; w: number; h: number }

/**
 * Direction in which a camera at distance d, at angle th from the direction of
 * travel, sees the ship: the angle (from the direction of travel, in the plane
 * through the camera and the path) of its largest image, or null if the ship
 * cannot be seen from there. Same light paths as the shader, traced backwards
 * from the camera; the bubble is symmetric about its path, so light aimed at
 * the ship stays in that plane.
 */
function shipImage(v: number, sigma: number, d: number, th: number): number | null {
  const tS = Math.tanh(sigma);
  const tanh = (x: number) => Math.tanh(Math.max(-15, Math.min(15, x)));
  const f = (r: number) => (tanh(sigma * (r + 1)) - tanh(sigma * (r - 1))) / (2 * tS);
  const df = (r: number) => {
    const a = tanh(sigma * (r + 1)), b = tanh(sigma * (r - 1));
    return (sigma * (b * b - a * a)) / (2 * tS);
  };
  const rOut = 1 + 4.5 / sigma;
  const px = d * Math.cos(th), py = d * Math.sin(th);
  // closest approach of the light to the ship, in ship sizes
  const miss = (beta: number) => {
    let x = px, y = py, qx = -Math.cos(beta), qy = -Math.sin(beta);
    const E = 1 - v * (1 - f(d)) * qx;
    const deriv = (x: number, y: number, qx: number, qy: number) => {
      const r = Math.max(Math.hypot(x, y), 1e-6);
      const V = v * (1 - f(r));
      const w = E + V * qx;
      const g = (-w * qx * v * df(r)) / r;
      return [qx - w * V, qy, g * x, g * y];
    };
    let best = Infinity;
    for (let i = 0; i < 800; i++) {
      const r = Math.hypot(x, y);
      const V = v * (1 - f(r));
      const w = E + V * qx;
      if (!(w > 1e-4) || !(qx * qx + qy * qy < 1e8)) break;
      const ux = qx - w * V, uy = qy;
      if (r >= rOut) {
        const b = -(x * ux + y * uy);
        const a = ux * ux + uy * uy, c = r * r - rOut * rOut * 0.9996;
        const disc = b * b - a * c;
        if (b >= 0 || disc <= 0) break;
        const s = (-b - Math.sqrt(disc)) / a;
        x -= s * ux;
        y -= s * uy;
        continue;
      }
      best = Math.min(best, Math.hypot(x / SHIP[0], y / SHIP[1]));
      if (best < 1) break;
      const h = -0.12 / (sigma * Math.max(Math.hypot(ux, uy), 1e-3));
      const k1 = deriv(x, y, qx, qy);
      const k2 = deriv(x + 0.5 * h * k1[0], y + 0.5 * h * k1[1], qx + 0.5 * h * k1[2], qy + 0.5 * h * k1[3]);
      const k3 = deriv(x + 0.5 * h * k2[0], y + 0.5 * h * k2[1], qx + 0.5 * h * k2[2], qy + 0.5 * h * k2[3]);
      const k4 = deriv(x + h * k3[0], y + h * k3[1], qx + h * k3[2], qy + h * k3[3]);
      x += (h / 6) * (k1[0] + 2 * (k2[0] + k3[0]) + k4[0]);
      y += (h / 6) * (k1[1] + 2 * (k2[1] + k3[1]) + k4[1]);
      qx += (h / 6) * (k1[2] + 2 * (k2[2] + k3[2]) + k4[2]);
      qy += (h / 6) * (k1[3] + 2 * (k2[3] + k3[3]) + k4[3]);
    }
    return best;
  };
  // scan every direction in the plane; each run of hits is one image of the ship
  const N = 360;
  const hit = Array.from({ length: N }, (_, i) => miss((2 * Math.PI * i) / N) < 1);
  let bestRun = 0, bestMid = -1;
  for (let i = 0; i < N; i++) {
    if (!hit[i] || hit[(i + N - 1) % N]) continue;
    let n = 0;
    while (n < N && hit[(i + n) % N]) n++;
    if (n > bestRun) {
      bestRun = n;
      bestMid = i + (n - 1) / 2;
    }
  }
  return bestMid < 0 ? null : (2 * Math.PI * bestMid) / N;
}

const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const SUN_Y = lum(blackbodyRGB(5800));
const JUPITER_KG = 1.898e27;
const KG_PER_METRE = 1.3466e27; // c^2 / G

/** Exotic (negative) energy for a 100 m bubble (Pfenning & Ford): E ~ v^2 R^2 / (12 wall thickness). */
function exoticJupiters(v: number, wall: number) {
  const R = 100;
  return ((v * v * R * R) / (12 * wall * R)) * KG_PER_METRE / JUPITER_KG;
}

class Warp implements Simulation {
  private bake: Program;
  private display: Program;
  private full: FBO | null = null;
  private preview: FBO | null = null;
  private key = "";
  private tiles: Tile[] = [];
  private tileIdx = 0;
  private tilesPerFrame = 4;
  private lastChange = 0;
  private lastRender = 0;
  private bakeUniforms: Record<string, number | number[] | Float32Array | boolean> = {};
  private dist = 0; // light years travelled
  private visible = true;
  private aimKey = "";
  private aim: number | null = null;
  private years = 0;

  constructor(private engine: Engine) {
    this.bake = new Program(engine.ctx, BAKE_FS);
    this.display = new Program(engine.ctx, DISPLAY_FS);
  }

  private ensureTargets(w: number, h: number) {
    if (this.full && this.full.width === w && this.full.height === h) return;
    const ctx = this.engine.ctx;
    const gl = ctx.gl;
    deleteFBO(ctx, this.full);
    deleteFBO(ctx, this.preview);
    const f32 = { internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT };
    const f16 = { internalFormat: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT, filter: gl.LINEAR };
    this.full = createFBO(ctx, w, h, [f32, f16]);
    this.preview = createFBO(ctx, Math.ceil(w / 4), Math.ceil(h / 4), [{ ...f16 }, f16]);
    this.key = "";
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

  /** Camera position (bubble radii, bubble frame) and basis (columns forward, right, up). */
  private camera(p: Params): { pos: number[]; basis: Float32Array } {
    if (str(p, "view") === "cockpit") {
      // ship frame: +x = direction of travel; same look convention as the light speed trip
      const L = yawPitch(num(p, "yaw"), -num(p, "pitch"));
      return { pos: [0, 0, 0], basis: new Float32Array([L[0], L[1], L[2], -L[3], -L[4], -L[5], L[6], L[7], L[8]]) };
    }
    const d = num(p, "distance"), th = num(p, "orbit") * DEG, ph = num(p, "roll") * DEG, v = num(p, "speed");
    const pos = [d * Math.cos(th), d * Math.sin(th) * Math.cos(ph), d * Math.sin(th) * Math.sin(ph)];
    // Aim at where the ship appears, not where it is: its light left it
    // earlier, and the wall bent it on the way (see shipImage).
    const aimKey = [v, num(p, "wall"), d, th].join("|");
    if (aimKey !== this.aimKey) {
      this.aimKey = aimKey;
      this.aim = shipImage(v, 2 / num(p, "wall"), d, th);
    }
    this.visible = this.aim !== null;
    const beta = this.aim ?? th + Math.PI;
    const f = [Math.cos(beta), Math.sin(beta) * Math.cos(ph), Math.sin(beta) * Math.sin(ph)];
    const e = [0, -Math.sin(ph), Math.cos(ph)];
    const ef = e[0] * f[0] + e[1] * f[1] + e[2] * f[2];
    const u0 = e.map((c, i) => c - ef * f[i]);
    const un = Math.hypot(...u0) || 1;
    const up = u0.map((c) => c / un);
    const right = [f[1] * up[2] - f[2] * up[1], f[2] * up[0] - f[0] * up[2], f[0] * up[1] - f[1] * up[0]];
    return { pos, basis: new Float32Array([...f, ...right, ...up]) };
  }

  render(params: Params, frame: { time: number; dt: number; width: number; height: number }) {
    const gl = this.engine.gl;
    const now = performance.now();
    const W = frame.width, H = frame.height;
    this.ensureTargets(W, H);
    const v = num(params, "speed");
    const wall = num(params, "wall");
    const cockpit = str(params, "view") === "cockpit";

    // ---- (re)trace the ray map when the camera or the bubble changes ----
    const cam = this.camera(params);
    const sigma = 2 / wall;
    const key = [v, wall, num(params, "fov"), cockpit, bool(params, "ship"), ...cam.pos, ...cam.basis, W, H].join("|");
    if (key !== this.key) {
      this.key = key;
      this.bakeUniforms = {
        uCamPos: cam.pos,
        uCamBasis: cam.basis,
        uZoom: 1 / Math.tan((num(params, "fov") * DEG) / 2),
        uV: v,
        uSigma: sigma,
        uTanhS: Math.tanh(sigma),
        uShip: bool(params, "ship") && !cockpit,
      };
      this.runBake(this.preview!, null);
      bindFBO(this.engine.ctx, this.full!);
      gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, -1]);
      gl.clearBufferfv(gl.COLOR, 1, [0, 0, 0, 0]);
      this.tiles = this.makeTiles(W, H);
      this.tileIdx = 0;
      this.lastChange = now;
    }
    if (this.tileIdx < this.tiles.length && now - this.lastChange > 120) {
      const frameMs = now - this.lastRender;
      if (frameMs < 24) this.tilesPerFrame = Math.min(this.tilesPerFrame + 2, 160);
      else if (frameMs > 45) this.tilesPerFrame = Math.max(1, Math.floor(this.tilesPerFrame * 0.6));
      const batch = this.tiles.slice(this.tileIdx, this.tileIdx + this.tilesPerFrame);
      this.runBake(this.full!, batch);
      this.tileIdx += batch.length;
      gl.flush();
    }
    this.lastRender = now;

    // ---- the trip: the bubble carries the ship through the stars ----
    const dYears = frame.dt * num(params, "yearsPerSecond");
    this.years += dYears;
    this.dist += v * dYears;
    const cell = num(params, "cellSize");
    const pos = this.dist / cell;
    const base = Math.floor(pos);
    const fov = num(params, "fov") * DEG;
    const comp = cockpit && bool(params, "autoExposure") && bool(params, "beaming")
      ? Math.pow(lum(blackbodyRGB(5800 * (1 + v))) / SUN_Y, -0.75)
      : 1;

    bindFBO(this.engine.ctx, this.engine.post.hdr);
    const f = this.full!, pv = this.preview!;
    const d = this.display.use();
    d.tex("uDir", 0, f.textures[0]).tex("uInfo", 1, f.textures[1])
      .tex("uPDir", 2, pv.textures[0]).tex("uPInfo", 3, pv.textures[1])
      .tex("uSky", 4, this.engine.skyTex, gl.TEXTURE_CUBE_MAP);
    this.engine.bindSpectrum(d, 5);
    const skyMode = str(params, "skyMode");
    d.set({
      uRes: [W, H],
      uV: v,
      uDopplerColor: bool(params, "dopplerColor"),
      uBeaming: bool(params, "beaming"),
      uExposureComp: comp,
      uGlow: bool(params, "exotic") ? num(params, "glowGain") : 0,
      uStars: bool(params, "nearStars"),
      uStarGain: num(params, "starGain") * 1e-4,
      uCellBase: new Int32Array([base, 0, 0]),
      uCellFrac: [pos - base, 0.5, 0.5],
      uDensity: num(params, "density"),
      uMaxCells: num(params, "maxCells"),
      uPixAng: (2 * Math.tan(fov / 2)) / W,
      uSkyMode: skyMode === "grid" ? 1 : 0,
      uSkyGain: skyMode === "none" ? 0 : num(params, "skyGain"),
      uSkyRot: skyRotation(num(params, "skyYaw"), 0),
    });
    d.draw();
  }

  onDrag(dx: number, dy: number, p: Params) {
    if (str(p, "view") === "cockpit") {
      return {
        yaw: Math.max(-180, Math.min(180, num(p, "yaw") - dx * 90)),
        pitch: Math.max(-89, Math.min(89, num(p, "pitch") - dy * 90)),
      };
    }
    return {
      orbit: Math.max(2, Math.min(178, num(p, "orbit") - dx * 120)),
      roll: (((num(p, "roll") + dy * 120) % 360) + 360) % 360,
    };
  }

  onWheel(deltaY: number, p: Params) {
    if (str(p, "view") === "cockpit") return { speed: Math.max(0, Math.min(10, num(p, "speed") - deltaY * 0.002)) };
    return { distance: Math.max(1.8, Math.min(14, num(p, "distance") * Math.exp(deltaY * 0.001))) };
  }

  hud(p: Params): HudItem[] {
    const v = num(p, "speed");
    const ly = (x: number) => (x < 1e4 ? `${x.toFixed(2)} ly` : `${x.toExponential(3)} ly`);
    const remaining = GALACTIC_CENTRE_LY - this.dist;
    const jup = exoticJupiters(v, num(p, "wall"));
    const items: HudItem[] = [
      { label: "Bubble speed", value: `${v.toFixed(2)} c` },
      { label: "Doppler ahead / behind", value: v < 1 ? `${(1 + v).toFixed(2)}× / ${(1 - v).toFixed(2)}×` : `${(1 + v).toFixed(2)}× / no light` },
      { label: "Ship time (same as Earth)", value: `${this.years.toFixed(2)} yr` },
      { label: "Distance travelled", value: ly(this.dist) },
      { label: "To galactic centre", value: remaining > 0 ? `${remaining.toFixed(0)} ly` : "Passed!" },
      { label: "Negative energy (100 m bubble)", value: jup < 0.01 ? "≈ 0" : `≈ ${jup < 1000 ? jup.toPrecision(3) : jup.toExponential(2)} × Jupiter` },
    ];
    if (!this.visible && str(p, "view") !== "cockpit") items.push({ label: "The bubble", value: "out of sight: move behind it" });
    return items;
  }

  status(): SimStatus | null {
    const n = this.tiles.length;
    if (!n) return null;
    const progress = this.tileIdx / n;
    return { progress, label: progress < 1 ? `Tracing light through the bubble ${(progress * 100).toFixed(0)}%` : "Ray map complete" };
  }

  dispose() {
    const ctx = this.engine.ctx;
    deleteFBO(ctx, this.full);
    deleteFBO(ctx, this.preview);
    this.bake.dispose();
    this.display.dispose();
  }
}

const outside = (p: Params) => p.view !== "cockpit";

export const warpSim: SimulationDescriptor = {
  id: "warp",
  title: "Warp Drive",
  tagline: "Ride an Alcubierre warp bubble faster than light",
  description:
    "An Alcubierre warp bubble: spacetime contracts ahead of the ship and expands behind it, so the ship rides along at any speed while sitting still inside. Light is traced through the bubble wall (RK4 on Hamilton's equations, in the bubble's own frame), and the frequency shift of every star follows from the light's conserved energy.",
  controlsHelp: "Drag: orbit the ship (outside) or look around (cockpit) · Wheel or pinch: distance (outside) or speed (cockpit)",
  params: [
    { key: "speed", label: "Bubble speed", group: "Bubble", kind: "range", default: 1.2, min: 0, max: 10, step: 0.01, unit: "c", digits: 2, hint: "In units of the speed of light. Above 1 c, light can no longer reach the ship from behind." },
    { key: "wall", label: "Wall thickness", group: "Bubble", kind: "range", default: 0.5, min: 0.15, max: 1.5, step: 0.01, unit: "R", digits: 2, hint: "In bubble radii. A thinner wall bends light more sharply and needs more negative energy." },
    {
      key: "view", label: "View", group: "Camera", kind: "select", default: "outside",
      options: [{ value: "outside", label: "Outside, following the bubble" }, { value: "cockpit", label: "From the cockpit" }],
      hint: "Outside: a chain of observers at rest among the stars, each catching the bubble as it passes the same spot.",
    },
    { key: "distance", label: "Distance", group: "Camera", kind: "range", default: 6, min: 1.8, max: 14, step: 0.01, unit: "R", digits: 2, visibleIf: outside },
    { key: "orbit", label: "Angle from the front", group: "Camera", kind: "range", default: 165, min: 2, max: 178, step: 0.1, unit: "°", digits: 1, visibleIf: outside, hint: "Above 1 c the bubble outruns its own light, so it can only be seen from a cone behind it, narrower the faster it goes." },
    { key: "roll", label: "Angle around the path", group: "Camera", kind: "range", default: 18, min: 0, max: 360, step: 0.1, unit: "°", digits: 1, visibleIf: outside },
    { key: "yaw", label: "Look yaw", group: "Camera", kind: "range", default: 0, min: -180, max: 180, step: 0.1, unit: "°", digits: 1, visibleIf: (p) => !outside(p), hint: "0° = straight ahead, 180° = looking back" },
    { key: "pitch", label: "Look pitch", group: "Camera", kind: "range", default: 0, min: -89, max: 89, step: 0.1, unit: "°", digits: 1, visibleIf: (p) => !outside(p) },
    { key: "fov", label: "Field of view", group: "Camera", kind: "range", default: 70, min: 20, max: 150, step: 0.5, unit: "°", digits: 1 },
    { key: "ship", label: "Ship", group: "Scene", kind: "toggle", default: true, visibleIf: outside },
    { key: "exotic", label: "Show negative energy", group: "Scene", kind: "toggle", default: true, hint: "Glow where the wall's exotic matter would be: a ring around the direction of travel" },
    { key: "glowGain", label: "Negative energy glow", group: "Scene", kind: "range", default: 0.3, min: 0, max: 2, step: 0.01, digits: 2, visibleIf: (p) => !!p.exotic },
    { key: "yearsPerSecond", label: "Time per second", group: "Scene", kind: "range", default: 1, min: 0, max: 20, step: 0.01, unit: "yr/s", digits: 2 },
    { key: "dopplerColor", label: "Doppler colour shift", group: "Light", kind: "toggle", default: true },
    { key: "beaming", label: "Brightness shift", group: "Light", kind: "toggle", default: true, hint: "Blueshifted light is brighter, redshifted light dimmer" },
    { key: "autoExposure", label: "Adapt exposure to speed", group: "Light", kind: "toggle", default: true, visibleIf: (p) => !outside(p) },
    { key: "nearStars", label: "Nearby 3D stars", group: "Stars", kind: "toggle", default: true },
    { key: "density", label: "Star density", group: "Stars", kind: "range", default: 0.2, min: 0.01, max: 1, step: 0.01, digits: 2, visibleIf: (p) => !!p.nearStars },
    { key: "cellSize", label: "Star spacing", group: "Stars", kind: "range", default: 3, min: 0.5, max: 50, step: 0.1, unit: "ly", digits: 1, visibleIf: (p) => !!p.nearStars },
    { key: "starGain", label: "Nearby star brightness", group: "Stars", kind: "range", default: 1, min: 0, max: 20, step: 0.05, digits: 2, visibleIf: (p) => !!p.nearStars },
    { key: "maxCells", label: "Star draw distance", group: "Stars", kind: "range", default: 64, min: 8, max: 256, step: 1, unit: "cells", digits: 0, visibleIf: (p) => !!p.nearStars },
    {
      key: "skyMode", label: "Background", group: "Sky", kind: "select", default: "milkyway",
      options: [{ value: "milkyway", label: "Milky Way (NASA)" }, { value: "grid", label: "Lensing grid" }, { value: "none", label: "None" }],
    },
    { key: "skyGain", label: "Sky brightness", group: "Sky", kind: "range", default: 4, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "skyYaw", label: "Sky rotation", group: "Sky", kind: "range", default: 0, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
  ],
  create: (engine) => new Warp(engine),
};
