// Flying past Earth at nearly the speed of light.
//
// Earth (and optionally the Moon) are at rest in their own frame; the camera
// moves along +x at beta = tanh(eta). Per pixel, the direction d' the light
// arrives from in the ship's frame becomes the Earth-frame direction d by
// aberration,  cos t = (cos t' - beta) / (1 - beta cos t'),  and the ray is
// traced backwards from the ship's position in Earth's frame, where Earth
// stands still. The light travel time is therefore exact, and the
// Terrell-Penrose rotation (a passing sphere looks turned, never squashed)
// emerges without any special treatment. Everything is shifted by the Doppler
// factor D = gamma (1 + beta cos t'):
//   * reflected sunlight, a 5778 K blackbody tinted by the ground, clouds and
//     air, and ~3000 K city lights;
//   * Earth's own heat, a 288 K blackbody (230 K at the cloud tops), invisible
//     at rest but shifted into view once D approaches 10 (0.98 c head on).
// All light is in units where sunlit ground at rest shows about its albedo.
// The NASA textures are made by scripts/preprocess-earth.mjs.

import type { Engine } from "../gl/engine";
import { Program, bindFBO } from "../gl/gl";
import { SKY_GLSL } from "../gl/sky";
import { SPECTRUM_GLSL, blackbodyRGB } from "../gl/spectrum";
import { DOPPLER_GLSL } from "../gl/doppler";
import { DEG, HudItem, Params, Simulation, SimulationDescriptor, SimStatus, bool, num, str } from "./types";
import { skyRotation } from "./skyrot";
import { formatSpeed } from "./lightspeed";

const R_EARTH_KM = 6371;
const LIGHT_SECONDS_PER_RADIUS = R_EARTH_KM / 299792.458;
const MOON_R = 1737.4 / R_EARTH_KM;
const W_SUN = 2.16e-5; // (R_sun / 1 AU)^2: how much sunlight is diluted by the time it reaches Earth
const START = -12; // the loop runs between these positions, in Earth radii
const END = 12;
const MOON_X = 58; // the Moon, about its real distance ahead (60 Earth radii)
const END_MOON = 70;

const FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uZoom;
uniform mat3 uCam;                 // ship frame, columns: forward, right, up
uniform float uBeta, uGamma;
uniform int uAberration;
uniform vec3 uPos;                 // ship position in Earth's frame, Earth radii
uniform vec3 uSun;                 // direction of the Sun
uniform float uTurn;               // Earth's rotation, radians
uniform sampler2D uDay, uClouds, uNight, uMoonTex;
uniform samplerCube uSky;
uniform int uShowClouds, uShowLights, uShowHeat, uShowAtmo, uMoon;
uniform vec3 uMoonPos;
uniform float uLights;
uniform float uExposureComp;
uniform int uDopplerColor, uBeaming;
${SKY_GLSL}
${SPECTRUM_GLSL}
${DOPPLER_GLSL}
out vec4 o;

const float W_SUN = ${W_SUN.toExponential(3)};
const float K = 1.2 / W_SUN;       // display scale
const float MOON_R = ${MOON_R.toFixed(5)};
const float ATMO_H = 0.012;        // glow scale height, Earth radii (~75 km)

float sphere(vec3 o, vec3 d, vec3 c, float r) {
  vec3 oc = o - c;
  float b = dot(oc, d);
  float h = b * b - dot(oc, oc) + r * r;
  if (h < 0.0) return -1.0;
  float t = -b - sqrt(h);
  return t > 0.0 ? t : -1.0;
}
vec2 lonLat(float lon, float z) {
  return vec2(fract(lon / (2.0 * PI) + 0.5), 0.5 - asin(clamp(z, -1.0, 1.0)) / PI);
}
// filtered lookup whose derivatives ignore the jump where longitude wraps
vec4 wrapped(sampler2D t, vec2 uv) {
  vec2 gx = dFdx(uv), gy = dFdy(uv);
  gx.x -= round(gx.x);
  gy.x -= round(gy.x);
  return textureGrad(t, uv, gx, gy);
}
// heat glow of a blackbody at T, seen shifted by D; it only reaches visible
// colours through the shift, so without it the glow stays invisible
vec3 heat(float T, float D) {
  return uDopplerColor == 1 && uBeaming == 1 ? planck(T * D) * K * 0.95 : vec3(0.0);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.x;
  vec3 ds = normalize(uCam * vec3(uZoom, uv));     // ship frame: where the light comes from
  float D = uGamma * (1.0 + uBeta * ds.x);          // observed / emitted frequency
  vec3 d = ds;
  if (uAberration == 1) {
    float c = (ds.x - uBeta) / (1.0 - uBeta * ds.x);
    float s = length(ds.yz);
    d = vec3(c, sqrt(max(0.0, 1.0 - c * c)) * (s > 1e-9 ? ds.yz / s : vec2(1.0, 0.0)));
  }
  // Earth's frame: follow the light back from the ship
  float tE = sphere(uPos, d, vec3(0.0), 1.0);
  float tM = uMoon == 1 ? sphere(uPos, d, uMoonPos, MOON_R) : -1.0;
  bool earth = tE > 0.0 && (tM < 0.0 || tE < tM);
  bool moon = tM > 0.0 && !earth;
  vec3 n = normalize(uPos + max(tE, 0.0) * d);
  vec3 m = normalize(uPos + max(tM, 0.0) * d - uMoonPos);
  // sample unconditionally: the derivatives need uniform control flow
  vec2 uvE = lonLat(atan(n.y, n.x) + uTurn, n.z);
  vec2 uvM = lonLat(atan(-m.y, -m.x), m.z);        // near side (longitude 0) faces Earth, along -x
  vec3 day = wrapped(uDay, uvE).rgb;
  float cloud = wrapped(uClouds, uvE).r * float(uShowClouds);
  float city = wrapped(uNight, uvE).r;
  vec3 moonAlbedo = wrapped(uMoonTex, uvM).rgb * 0.42;
  vec3 sky = skyColor(uSky, d);

  vec3 sun = planck(5778.0) * W_SUN * K;           // sunlight arriving at Earth
  vec3 V = -d;
  vec3 col;
  if (earth) {
    float mu = dot(n, uSun);
    float lit = max(mu, 0.0);
    float water = smoothstep(0.15, 0.35, (day.b - max(day.r, day.g)) / (day.b + 0.02)) * (1.0 - cloud);
    vec3 albedo = mix(day, vec3(0.8), cloud);
    vec3 refl = albedo * sun * lit;
    // sun glint on the oceans
    refl += sun * water * 0.3 * pow(max(dot(n, normalize(uSun + V)), 0.0), 220.0) * smoothstep(0.0, 0.1, mu);
    // blue haze of the air towards the edge of the day side
    if (uShowAtmo == 1) refl += sun * vec3(0.16, 0.3, 0.72) * 0.45 * pow(1.0 - max(dot(n, V), 0.0), 3.0) * smoothstep(-0.15, 0.35, mu);
    col = shiftBlackbody(refl, 5778.0, D);
    if (uShowLights == 1) {
      vec3 lights = planck(3000.0) / luminance(planck(3000.0)) * city * city * uLights
                  * (1.0 - smoothstep(-0.12, 0.05, mu)) * (1.0 - 0.7 * cloud);
      col += shiftBlackbody(lights, 3000.0, D);
    }
    if (uShowHeat == 1) col += heat(mix(288.0, 230.0, cloud), D);
  } else if (moon) {
    float lit = max(dot(m, uSun), 0.0);
    col = shiftBlackbody(moonAlbedo * sun * lit, 5778.0, D);
    // airless: about 390 K under the Sun, 100 K at night
    if (uShowHeat == 1) col += heat(mix(100.0, 390.0, pow(lit, 0.25)), D) * 0.7;
  } else {
    col = shiftRadiance(sky, D);
    if (uShowAtmo == 1) {
      // glow of the sunlit air around the edge of the Earth
      float tc = max(dot(-uPos, d), 0.0);
      vec3 q = uPos + tc * d;
      float p = length(q);
      float g = exp(-max(p - 1.0, 0.0) / ATMO_H) * smoothstep(-0.25, 0.3, dot(q / p, uSun));
      col += shiftBlackbody(sun * vec3(0.16, 0.3, 0.72) * 0.6 * g, 5778.0, D);
    }
  }
  o = vec4(col * uExposureComp, 1.0);
}`;

// ---- textures ----

interface Maps { day: WebGLTexture; clouds: WebGLTexture; night: WebGLTexture; moon: WebGLTexture }

const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
/** How bright Earth looks (visible light, arbitrary units) when its light is shifted by D. */
const earthGlow = (D: number) => Math.max(0.3 * W_SUN * lum(blackbodyRGB(5778 * D)), 0.95 * lum(blackbodyRGB(288 * D)));
const EARTH_REST = earthGlow(1);

class Flyby implements Simulation {
  private prog: Program;
  private maps: Maps;
  private tier = 0;
  private requested = 0;
  private loading: string | null = null;
  private x = START;
  private look: number[] | null = null;
  private eta = 0;
  private D = 1;
  private altitude = 0;
  private nearMoon = false;

  constructor(private engine: Engine) {
    this.prog = new Program(engine.ctx, FS);
    // placeholders until the NASA maps arrive
    this.maps = {
      day: this.solid([12, 28, 60]),
      clouds: this.solid([0, 0, 0]),
      night: this.solid([0, 0, 0]),
      moon: this.solid([120, 120, 120]),
    };
  }

  private texture(): WebGLTexture {
    const gl = this.engine.gl;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const aniso = this.engine.ctx.anisoExt;
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, this.engine.ctx.caps.anisotropy));
    return t;
  }

  private solid(rgb: number[]): WebGLTexture {
    const gl = this.engine.gl;
    const t = this.texture();
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([...rgb, 255]));
    gl.generateMipmap(gl.TEXTURE_2D);
    return t;
  }

  /** Download, decode and upload one map; colour maps are sRGB, the others single-channel. */
  private async load(url: string, colour: boolean): Promise<WebGLTexture> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    const bmp = await createImageBitmap(await res.blob(), { colorSpaceConversion: "none", premultiplyAlpha: "none" });
    const gl = this.engine.gl;
    const t = this.texture();
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (colour) gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gl.RED, gl.UNSIGNED_BYTE, bmp);
    gl.generateMipmap(gl.TEXTURE_2D);
    bmp.close();
    return t;
  }

  /** The detail level asked for, capped on phones and by the GPU; a small set first, then the full one. */
  private requestMaps(detail: number) {
    const cap = Math.min(this.engine.ctx.caps.maxTexture, this.engine.constrained ? 2048 : 8192);
    const tier = Math.min(detail || 4096, cap);
    if (tier === this.requested) return;
    this.requested = tier;
    (async () => {
      for (const t of tier > 2048 && this.tier < 2048 ? [2048, tier] : [tier]) {
        if (this.requested !== tier) return;
        this.loading = `Loading Earth ${t}…`;
        try {
          const base = `/ray-tracing/earth/${t}/`;
          // one at a time, so only one decoded image is in memory
          const day = await this.load(`${base}day.jpg`, true);
          const clouds = await this.load(`${base}clouds.jpg`, false);
          const night = await this.load(`${base}night.jpg`, false);
          const moon = await this.load(`/ray-tracing/moon/${t / 2}/moon.jpg`, true);
          const old = this.maps;
          this.maps = { day, clouds, night, moon };
          this.tier = t;
          Object.values(old).forEach((tex) => this.engine.gl.deleteTexture(tex));
        } catch (err) {
          console.error(err);
          this.loading = "Earth maps failed to load";
          return;
        }
      }
      this.loading = null;
    })();
  }

  render(params: Params, frame: { time: number; dt: number; width: number; height: number }) {
    const gl = this.engine.gl;
    this.requestMaps(Number(params.earthDetail));
    const eta = num(params, "speed");
    this.eta = eta;
    const beta = Math.tanh(eta), gamma = Math.cosh(eta);
    const withMoon = bool(params, "moon");
    const end = withMoon ? END_MOON : END;

    // ---- where the ship is, in Earth's frame ----
    let restart = false;
    if (str(params, "motion") === "manual") this.x = num(params, "position");
    else {
      this.x += frame.dt * num(params, "pace");
      if (this.x >= end) {
        this.x = START;
        restart = true;
      }
    }
    const b = 1 + num(params, "altitude") / R_EARTH_KM;
    const pos = [this.x, -b, 0];
    const moonPos = [MOON_X, -b - 0.8, 0];
    this.nearMoon = withMoon && this.x > MOON_X / 2;
    this.altitude = this.nearMoon
      ? (Math.hypot(pos[0] - moonPos[0], pos[1] - moonPos[1], pos[2] - moonPos[2]) - MOON_R) * R_EARTH_KM
      : (Math.hypot(...pos) - 1) * R_EARTH_KM;

    // ---- camera: look where the chosen body appears ----
    const aberr = bool(params, "aberration");
    const seen = (target: number[]) => {
      const u = target.map((c, i) => c - pos[i]);
      const l = Math.hypot(...u);
      const c = u[0] / l;
      const cs = aberr ? (c + beta) / (1 + beta * c) : c;
      const t = Math.hypot(u[1], u[2]) || 1;
      const s = Math.sqrt(Math.max(0, 1 - cs * cs));
      return [cs, (s * u[1]) / t, (s * u[2]) / t];
    };
    const lookMode = str(params, "look");
    const toMoon = withMoon && (lookMode === "moon" || (lookMode === "auto" && this.x > MOON_X / 2));
    const target = lookMode === "ahead" ? [1, 0, 0] : seen(toMoon ? moonPos : [0, 0, 0]);
    // turn smoothly when switching bodies; snap when the loop restarts
    if (!this.look || restart) this.look = target;
    else {
      const k = 1 - Math.exp(-4 * Math.max(frame.dt, 1 / 240));
      const l = this.look.map((c, i) => c + (target[i] - c) * k);
      const n = Math.hypot(...l);
      this.look = l.map((c) => c / n);
    }
    this.D = gamma * (1 + beta * seen(toMoon ? moonPos : [0, 0, 0])[0]);
    const yaw = Math.atan2(this.look[1], this.look[0]) + num(params, "yaw") * DEG;
    const pitch = Math.max(-89 * DEG, Math.min(89 * DEG, Math.asin(Math.max(-1, Math.min(1, this.look[2]))) + num(params, "pitch") * DEG));
    const f = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch)];
    const right = [Math.sin(yaw), -Math.cos(yaw), 0];
    const up = [right[1] * f[2] - right[2] * f[1], right[2] * f[0] - right[0] * f[2], right[0] * f[1] - right[1] * f[0]];

    const sunAz = num(params, "sunAngle") * DEG, sunDec = num(params, "season") * DEG;
    const comp = bool(params, "autoExposure") && bool(params, "beaming")
      ? Math.min(30, Math.max(1e-3, Math.pow(earthGlow(Math.min(this.D, 1e4)) / EARTH_REST, -0.75)))
      : 1;
    const skyMode = str(params, "skyMode");

    bindFBO(this.engine.ctx, this.engine.post.hdr);
    const p = this.prog.use();
    p.tex("uDay", 0, this.maps.day).tex("uClouds", 1, this.maps.clouds).tex("uNight", 2, this.maps.night).tex("uMoonTex", 3, this.maps.moon)
      .tex("uSky", 4, this.engine.skyTex, gl.TEXTURE_CUBE_MAP);
    this.engine.bindSpectrum(p, 5);
    p.set({
      uRes: [frame.width, frame.height],
      uZoom: 1 / Math.tan((num(params, "fov") * DEG) / 2),
      uCam: new Float32Array([...f, ...right, ...up]),
      uBeta: beta,
      uGamma: gamma,
      uAberration: aberr,
      uPos: pos,
      uSun: [Math.cos(sunDec) * Math.cos(sunAz), Math.cos(sunDec) * Math.sin(sunAz), Math.sin(sunDec)],
      uTurn: num(params, "turn") * DEG,
      uShowClouds: bool(params, "clouds"),
      uShowLights: bool(params, "cityLights"),
      uShowHeat: bool(params, "heat"),
      uShowAtmo: bool(params, "atmosphere"),
      uMoon: withMoon,
      uMoonPos: moonPos,
      uLights: num(params, "lightsGain") * 0.15,
      uExposureComp: comp,
      uDopplerColor: bool(params, "dopplerColor"),
      uBeaming: bool(params, "beaming"),
      uSkyMode: skyMode === "grid" ? 1 : 0,
      uSkyGain: skyMode === "none" ? 0 : num(params, "skyGain"),
      uSkyRot: skyRotation(num(params, "skyYaw"), 60),
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
    return { speed: Math.max(0, Math.min(4, num(p, "speed") - deltaY * 0.001)) };
  }

  hud(p: Params): HudItem[] {
    const beta = Math.tanh(this.eta);
    const crossing = beta > 0 ? (2 * LIGHT_SECONDS_PER_RADIUS) / beta : Infinity;
    const real = beta / LIGHT_SECONDS_PER_RADIUS; // Earth radii per second at this speed
    const slow = real / Math.max(num(p, "pace"), 1e-6);
    const toMoon = this.nearMoon;
    return [
      { label: "Speed", value: formatSpeed(this.eta) },
      { label: toMoon ? "Height above the Moon" : "Altitude", value: `${Math.round(this.altitude).toLocaleString("en-US")} km` },
      { label: `${toMoon ? "The Moon's" : "Earth's"} light shifted by`, value: `${this.D < 100 ? this.D.toFixed(2) : this.D.toExponential(2)}×` },
      { label: `${toMoon ? "Its" : "Its 288 K"} heat glow looks like`, value: `${Math.round((toMoon ? 390 : 288) * this.D).toLocaleString("en-US")} K` },
      { label: "Crossing Earth takes", value: Number.isFinite(crossing) ? `${(crossing * 1000).toFixed(1)} ms` : "forever" },
      slow >= 1
        ? { label: "Shown slowed down by", value: `${slow < 1000 ? slow.toFixed(1) : slow.toExponential(1)}×` }
        : { label: "Shown sped up by", value: slow > 0 ? `${(1 / slow).toFixed(1)}×` : "—" },
    ];
  }

  status(): SimStatus | null {
    return this.loading ? { progress: 0.5, label: this.loading } : null;
  }

  dispose() {
    this.prog.dispose();
    Object.values(this.maps).forEach((tex) => this.engine.gl.deleteTexture(tex));
  }
}

export const flybySim: SimulationDescriptor = {
  id: "flyby",
  title: "Flying Past Earth",
  tagline: "Race past the Earth at nearly the speed of light",
  description:
    "The Earth, from NASA's Blue Marble and Black Marble maps, seen from a ship racing past at relativistic speed. Every pixel's light is traced back into Earth's frame, so aberration, light travel time and the Terrell rotation are exact, and its colour is shifted as a blackbody: sunlight, city lights and Earth's own heat glow.",
  controlsHelp: "Drag: look around · Wheel or pinch: change speed",
  params: [
    { key: "speed", label: "Speed", group: "Flight", kind: "range", default: 1.472, min: 0, max: 4, step: 0.001, digits: 3, format: formatSpeed, hint: "Rapidity η: β = tanh η, γ = cosh η" },
    { key: "altitude", label: "Closest approach", group: "Flight", kind: "range", default: 4000, min: 300, max: 40000, step: 10, unit: "km", digits: 0, hint: "Height above the surface where the path passes closest to Earth" },
    {
      key: "motion", label: "Motion", group: "Flight", kind: "select", default: "loop",
      options: [{ value: "loop", label: "Fly past (loop)" }, { value: "manual", label: "Manual" }],
    },
    { key: "pace", label: "Playback speed", group: "Flight", kind: "range", default: 2.5, min: 0.1, max: 20, step: 0.05, unit: "R⊕/s", digits: 2, visibleIf: (p) => p.motion !== "manual", hint: "Earth radii covered per second on screen; the real flight is far faster" },
    { key: "position", label: "Position along the path", group: "Flight", kind: "range", default: -2, min: -30, max: 80, step: 0.01, unit: "R⊕", digits: 2, visibleIf: (p) => p.motion === "manual", hint: "In Earth radii from the point of closest approach, in Earth's frame" },
    { key: "moon", label: "Pass the Moon too", group: "Flight", kind: "toggle", default: false, hint: "The Moon, at about its real distance ahead" },
    {
      key: "look", label: "Look at", group: "Camera", kind: "select", default: "auto",
      options: [{ value: "auto", label: "Earth, then the Moon" }, { value: "moon", label: "The Moon" }, { value: "ahead", label: "Straight ahead" }],
    },
    { key: "fov", label: "Field of view", group: "Camera", kind: "range", default: 55, min: 10, max: 150, step: 0.5, unit: "°", digits: 1 },
    { key: "yaw", label: "Look yaw", group: "Camera", kind: "range", default: 0, min: -180, max: 180, step: 0.1, unit: "°", digits: 1 },
    { key: "pitch", label: "Look pitch", group: "Camera", kind: "range", default: 0, min: -89, max: 89, step: 0.1, unit: "°", digits: 1 },
    { key: "aberration", label: "Aberration", group: "Relativity", kind: "toggle", default: true, hint: "Turn off to see where things would be without it: no rotation, no squeezing forwards" },
    { key: "dopplerColor", label: "Doppler colour shift", group: "Relativity", kind: "toggle", default: true },
    { key: "beaming", label: "Relativistic beaming", group: "Relativity", kind: "toggle", default: true, hint: "Searchlight effect: brightness scales with the Doppler factor" },
    { key: "autoExposure", label: "Adapt exposure to the light", group: "Relativity", kind: "toggle", default: true, hint: "Like an eye adapting as Earth brightens ahead and darkens behind" },
    { key: "turn", label: "Earth's rotation", group: "Earth", kind: "range", default: 100, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
    { key: "sunAngle", label: "Sun direction", group: "Earth", kind: "range", default: 160, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
    { key: "season", label: "Sun height (season)", group: "Earth", kind: "range", default: 15, min: -23.4, max: 23.4, step: 0.1, unit: "°", digits: 1 },
    { key: "clouds", label: "Clouds", group: "Earth", kind: "toggle", default: true },
    { key: "cityLights", label: "City lights", group: "Earth", kind: "toggle", default: true },
    { key: "lightsGain", label: "City light brightness", group: "Earth", kind: "range", default: 1, min: 0, max: 10, step: 0.05, digits: 2, visibleIf: (p) => !!p.cityLights },
    { key: "heat", label: "Earth's heat glow", group: "Earth", kind: "toggle", default: true, hint: "Earth's own infrared glow (288 K), visible only once it is blueshifted into view" },
    { key: "atmosphere", label: "Atmosphere", group: "Earth", kind: "toggle", default: true },
    {
      key: "earthDetail", label: "Earth map detail", group: "Earth", kind: "select", default: "4096",
      options: [{ value: "8192", label: "Ultra: 8192 × 4096 (10 MB)" }, { value: "4096", label: "High: 4096 × 2048 (3 MB)" }, { value: "2048", label: "Medium: 2048 × 1024 (1 MB)" }],
      hint: "NASA Blue Marble, Black Marble and cloud maps. Phones and tablets are limited to Medium.",
    },
    {
      key: "skyMode", label: "Background", group: "Sky", kind: "select", default: "milkyway",
      options: [{ value: "milkyway", label: "Milky Way (NASA)" }, { value: "grid", label: "Aberration grid" }, { value: "none", label: "None" }],
    },
    { key: "skyGain", label: "Sky brightness", group: "Sky", kind: "range", default: 4, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "skyYaw", label: "Sky rotation", group: "Sky", kind: "range", default: 0, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
  ],
  create: (engine) => new Flyby(engine),
};
