// A neutron star: a city-sized ball of neutrons, so dense that its gravity
// bends light enough to show part of its far side.
//
// The star is a sphere of radius R in the Schwarzschild spacetime of its mass
// M (units G = c = M = 1 in the shaders); the camera is a static observer at
// radius rc. Because the star is round, a ray's path depends only on its angle
// to the vertical at the camera, so the rays from the camera are integrated
// (RK4 on the orbit equation) into a 1D table, re-baked whenever the size,
// mass or distance changes: where each ray meets the surface (the angle psi
// around the star from the point facing the camera, and the emission angle)
// or, if it misses, which way it finally leaves (lensed background stars).
//
// The surface glows at about a million kelvin, with two hotter polar caps
// on the magnetic axis. Each point is a blackbody seen with its frequency
// shifted by g = delta sqrt(1 - 2M/R) / sqrt(1 - 2M/rc): gravitational
// redshift times the Doppler factor delta of the spinning surface.
//
// The pulse profile (brightness over one turn) is computed on the CPU with
// Beloborodov's approximation for light bending, cos a = u + (1 - u) cos psi
// with u = 2M/R, and the Doppler boosting of Poutanen & Beloborodov (2006).

import type { Engine } from "../gl/engine";
import { FBO, Program, bindFBO, createFBO, deleteFBO } from "../gl/gl";
import { SKY_GLSL } from "../gl/sky";
import { SPECTRUM_GLSL } from "../gl/spectrum";
import { DOPPLER_GLSL } from "../gl/doppler";
import { DEG, HudItem, Params, Simulation, SimulationDescriptor, SimCurve, bool, num, str } from "./types";
import { skyRotation } from "./skyrot";

const LUT_N = 8192;
const SUN_KM = 1.4766; // GM_sun / c^2
const C_KM = 299792.458;

// Where each table entry points, as a function of the camera radius rc:
//   u in [0, 0.6):    inward rays, impact parameter b in [0, b1) (the star and its edge, finely)
//   u in [0.6, 0.85): inward rays, b in [b1, bmax), denser near b1
//   u in [0.85, 1]:   outward rays, angle from straight out in [90°, 0°]
const MAPPING_GLSL = /* glsl */ `
uniform float uRc, uB1, uBmax, uFc;   // camera radius, b at the end of the fine region, b at 90°, 1 - 2M/rc
const float PI = 3.14159265358979;
// angle of a ray from straight out (away from the star), for table position u
float rayAngle(float u) {
  if (u >= 0.85) return (1.0 - (u - 0.85) / 0.15) * 0.5 * PI;
  float b = u < 0.6 ? u / 0.6 * uB1 : uB1 + (uBmax - uB1) * pow((u - 0.6) / 0.25, 2.0);
  return PI - asin(clamp(b * sqrt(uFc) / uRc, 0.0, 1.0));
}
// and back: table position of a ray at angle a from straight out
float tablePos(float a) {
  if (a <= 0.5 * PI) return 0.85 + 0.15 * (1.0 - a / (0.5 * PI));
  float b = uRc * sin(a) / sqrt(uFc);
  return b < uB1 ? 0.6 * b / uB1 : 0.6 + 0.25 * sqrt(clamp((b - uB1) / max(uBmax - uB1, 1e-6), 0.0, 1.0));
}`;

const BAKE_FS = /* glsl */ `#version 300 es
precision highp float;
uniform float uN;
uniform float uR;        // star radius
uniform float uGrav;     // 1: general relativity, 0: light travels straight
${MAPPING_GLSL}
out vec4 o;
// state (r, phi, dr/dlambda), energy scaled to 1
vec3 deriv(vec3 s, float b) {
  float ir = 1.0 / s.x;
  float ir2 = ir * ir;
  return vec3(s.z, b * ir2, b * b * ir2 * ir - 3.0 * uGrav * b * b * ir2 * ir2);
}
void main() {
  float u = floor(gl_FragCoord.x) / (uN - 1.0);
  float a = rayAngle(u);
  float b = uRc * sin(a) / sqrt(uFc);
  // traced backwards from the camera: moving outwards when a < 90°
  vec3 s = vec3(uRc, 0.0, cos(a));
  float rFar = max(2000.0, 50.0 * uRc);
  vec4 res = vec4(0.0);
  for (int i = 0; i < 20000; i++) {
    float r = s.x;
    if (r > rFar) { res = vec4(s.y + atan(b / r, s.z), 0.0, 2.0, 1.0); break; }
    if (s.y > 8.0 * PI) break;     // winding round a photon sphere outside the star: sub-pixel rings
    float h = 0.02 * min(r / max(abs(s.z), 1e-3), r * r / max(b, 1e-6));
    // heading for the surface: do not step far past it (the crossing is interpolated)
    if (s.z < 0.0) h = min(h, (r - uR) / -s.z + 0.002 * uR);
    h = clamp(h, 1e-5, 0.05 * r);
    vec3 k1 = deriv(s, b);
    vec3 k2 = deriv(s + 0.5 * h * k1, b);
    vec3 k3 = deriv(s + 0.5 * h * k2, b);
    vec3 k4 = deriv(s + h * k3, b);
    vec3 n = s + (h / 6.0) * (k1 + 2.0 * (k2 + k3) + k4);
    if (n.x <= uR) {
      float t = (s.x - uR) / max(s.x - n.x, 1e-9);
      vec3 hit = mix(s, n, t);
      // psi: angle round the star from the point facing the camera; cos of the emission angle
      res = vec4(hit.y, clamp(-hit.z, 0.0, 1.0), 1.0, 1.0);
      break;
    }
    s = n;
  }
  o = res;
}`;

const DISPLAY_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uLut;
uniform float uN;
uniform vec2 uRes;
uniform float uZoom;
uniform mat3 uCam;          // columns: forward, right, up
uniform vec3 uA;            // from the star's centre towards the camera
uniform float uSpin;        // rotation angle of the star
uniform vec3 uMag;          // magnetic axis, in the star's rotating frame
uniform float uCapCos;      // cosine of the hot cap radius
uniform float uTs, uTc;     // surface and cap temperatures
uniform float uBeta;        // equator speed / c, measured on the surface
uniform float uGshift;      // gravitational frequency shift, surface to camera
uniform float uSkyShift;    // blueshift of starlight at the camera
uniform int uMode;          // 0: X-ray (false colour), 1: visible light
uniform int uGrid;
uniform samplerCube uSky;
uniform int uDopplerColor, uBeaming;
${SKY_GLSL}
${SPECTRUM_GLSL}
${DOPPLER_GLSL}
${MAPPING_GLSL.replace("const float PI = 3.14159265358979;", "")}
out vec4 o;

vec4 lut(int i) { return texelFetch(uLut, ivec2(clamp(i, 0, int(uN) - 1), 0), 0); }
vec3 rotZ(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(c * v.x - s * v.y, s * v.x + c * v.y, v.z); }
float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
// "inferno" colour map (Matt Zucker's fit), returned in linear light
vec3 inferno(float t) {
  const vec3 c0 = vec3(0.0002189403691192265, 0.001651004631001012, -0.01948089843709184);
  const vec3 c1 = vec3(0.1065134194856116, 0.5639564367884091, 3.932712388889277);
  const vec3 c2 = vec3(11.60249308247187, -3.972853965665698, -15.9423941062914);
  const vec3 c3 = vec3(-41.70399613139459, 17.43639888205313, 44.35414519872813);
  const vec3 c4 = vec3(77.162935699427, -33.40235894210092, -81.80730925738993);
  const vec3 c5 = vec3(-71.31942824499214, 32.62606426397723, 73.20951985803202);
  const vec3 c6 = vec3(25.13112622477341, -12.24266895238567, -23.07032500287172);
  vec3 c = c0 + t * (c1 + t * (c2 + t * (c3 + t * (c4 + t * (c5 + t * c6)))));
  return pow(clamp(c, 0.0, 1.0), vec3(2.2));
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.x;
  vec3 d = normalize(uCam * vec3(uZoom, uv));        // where the light comes from
  float ca = clamp(dot(d, uA), -1.0, 1.0);
  vec3 e = d - ca * uA;
  float el = length(e);
  e = el > 1e-7 ? e / el : normalize(cross(uA, vec3(0.3, 0.5, 0.8)));
  float f = tablePos(acos(ca)) * (uN - 1.0);
  int i0 = int(floor(f));
  float t = f - float(i0);
  vec4 p = lut(i0), q = lut(i0 + 1);
  vec4 v = t < 0.5 ? p : q;
  // interpolate, but never between rays that end differently
  if (p.z == q.z) v.xy = mix(p.xy, q.xy, t);
  vec3 sky = skyColor(uSky, cos(v.x) * uA + sin(v.x) * e);  // derivatives: sample unconditionally
  vec3 col = vec3(0.0);
  if (v.z > 1.5) {
    col = shiftRadiance(sky, uSkyShift);
  } else if (v.z > 0.5) {
    float psi = v.x, cosE = v.y, sinE = sqrt(max(0.0, 1.0 - cosE * cosE));
    vec3 n = cos(psi) * uA + sin(psi) * e;           // the point of the surface we see
    vec3 nr = rotZ(n, -uSpin);                       // in the star's rotating frame
    float pole = max(dot(nr, uMag), -dot(nr, uMag));
    float cap = smoothstep(uCapCos - 0.015, uCapCos + 0.015, pole);
    float T = mix(uTs * (0.9 + 0.2 * noise(nr * 7.0)), uTc * (0.9 + 0.2 * smoothstep(uCapCos, 1.0, pole)), cap);
    // Doppler shift of the spinning surface: the light leaves along k
    vec3 tan_ = sin(psi) * uA - cos(psi) * e;
    vec3 k = cosE * n + sinE * tan_;
    vec3 vel = uBeta * vec3(-n.y, n.x, 0.0);
    float gam = inversesqrt(max(1.0 - dot(vel, vel), 1e-6));
    float delta = 1.0 / (gam * (1.0 - dot(vel, k)));
    float g = (uDopplerColor == 1 || uBeaming == 1 ? delta : 1.0) * uGshift;
    if (uMode == 1) {
      // visible light: the Rayleigh-Jeans tail of a million-kelvin blackbody, blue-white,
      // in units of the plain surface's brightness
      col = planck(T * g) / luminance(planck(uTs * uGshift)) * 0.6;
    } else {
      // X-rays, false colour: bolometric brightness ~ (g T)^4 on a log scale
      float I = pow(T * g / (uTs * uGshift), 4.0);
      float x = clamp(0.3 + 0.12 * log2(I), 0.0, 1.0);
      col = inferno(x) * mix(0.8, 4.0, x * x);
    }
    if (uGrid == 1) {
      // latitude and longitude every 30°, equator brighter
      float lat = asin(clamp(nr.z, -1.0, 1.0)) / (PI / 6.0);
      float lon = atan(nr.y, nr.x) / (PI / 6.0);
      vec2 g2 = abs(fract(vec2(lat, lon) + 0.5) - 0.5) / fwidth(vec2(lat, lon));
      float line = 1.0 - min(min(g2.x, g2.y), 1.0);
      float eq = 1.0 - min(abs(lat) / fwidth(lat) * 0.5, 1.0);
      vec3 ink = uMode == 1 ? vec3(0.02, 0.03, 0.08) : vec3(0.3, 0.85, 1.0) * 0.9;
      col = mix(col, ink, 0.55 * max(line, eq));
    }
  }
  o = vec4(col, 1.0);
}`;

/** Fraction of the surface in view, from Beloborodov's approximation: the limb is at cos psi = -u / (1 - u). */
function visibleFraction(u: number) {
  return Math.min(1, 1 / (2 * (1 - u)));
}

class NeutronStar implements Simulation {
  private bake: Program;
  private display: Program;
  private lut: FBO;
  private key = "";
  private spin = 0;
  private uniforms: Record<string, number> = {};
  private curveKey = "";
  private curveValues: number[] = [];

  constructor(private engine: Engine) {
    const ctx = engine.ctx;
    const gl = ctx.gl;
    this.bake = new Program(ctx, BAKE_FS);
    this.display = new Program(ctx, DISPLAY_FS);
    this.lut = createFBO(ctx, LUT_N, 1, [{ internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT }]);
  }

  /** Star and camera in units of GM/c^2, with the star never more compact than allowed. */
  private geometry(p: Params) {
    const M = SUN_KM * num(p, "mass");
    const R = Math.max(num(p, "radius") / M, 2.3);
    const rc = Math.max(num(p, "distance") / M, R * 1.05);
    return { M, R, rc };
  }

  private camera(p: Params) {
    const i = num(p, "inclination") * DEG, az = num(p, "azimuth") * DEG;
    const a = [Math.sin(i) * Math.cos(az), Math.sin(i) * Math.sin(az), Math.cos(i)];
    const f = a.map((c) => -c);
    // screen up: the spin axis, made perpendicular to the view
    const z = [0, 0, 1];
    const fz = f[2];
    let up = z.map((c, k) => c - fz * f[k]);
    const ul = Math.hypot(...up);
    up = ul > 1e-6 ? up.map((c) => c / ul) : [Math.cos(az), Math.sin(az), 0];
    const right = [f[1] * up[2] - f[2] * up[1], f[2] * up[0] - f[0] * up[2], f[0] * up[1] - f[1] * up[0]];
    return { a, basis: new Float32Array([...f, ...right, ...up]) };
  }

  render(params: Params, frame: { time: number; dt: number; width: number; height: number }) {
    const gl = this.engine.gl;
    const ctx = this.engine.ctx;
    const grav = bool(params, "gravity") ? 1 : 0;
    const { R, rc } = this.geometry(params);

    // ---- re-bake the light paths when the star or the distance changes ----
    const key = [R, rc, grav].join("|");
    if (key !== this.key) {
      this.key = key;
      const fc = grav ? 1 - 2 / rc : 1;
      const fr = grav ? 1 - 2 / R : 1;
      // the star's edge: the ray grazing the surface, or the photon sphere if that lies outside it
      const be = grav && R < 3 ? Math.sqrt(27) : R / Math.sqrt(fr);
      const bmax = rc / Math.sqrt(fc);
      this.uniforms = { uRc: rc, uFc: fc, uB1: Math.min(1.15 * be, bmax * 0.999), uBmax: bmax };
      bindFBO(ctx, this.lut);
      this.bake.use().set({ ...this.uniforms, uN: LUT_N, uR: R, uGrav: grav }).draw();
    }

    this.spin = (this.spin + 2 * Math.PI * num(params, "spinShown") * frame.dt) % (2 * Math.PI);
    const cam = this.camera(params);
    const chi = num(params, "tilt") * DEG;
    const periodS = num(params, "period") / 1000;
    const vEq = (2 * Math.PI * num(params, "radius")) / periodS / C_KM; // equator speed / c, far away
    const beta = Math.min(0.95, grav ? vEq / Math.sqrt(1 - 2 / R) : vEq);

    bindFBO(ctx, this.engine.post.hdr);
    const d = this.display.use();
    d.tex("uLut", 0, this.lut.textures[0]).tex("uSky", 1, this.engine.skyTex, gl.TEXTURE_CUBE_MAP);
    this.engine.bindSpectrum(d, 2);
    const skyMode = str(params, "skyMode");
    d.set({
      ...this.uniforms,
      uN: LUT_N,
      uRes: [frame.width, frame.height],
      uZoom: 1 / Math.tan((num(params, "fov") * DEG) / 2),
      uCam: cam.basis,
      uA: cam.a,
      uSpin: this.spin,
      uMag: [Math.sin(chi), 0, Math.cos(chi)],
      uCapCos: Math.cos(num(params, "capSize") * DEG),
      uTs: num(params, "surfaceTemp") * 1e6,
      uTc: num(params, "capTemp") * 1e6,
      uBeta: beta,
      uGshift: grav ? Math.sqrt((1 - 2 / R) / (1 - 2 / rc)) : 1,
      uSkyShift: grav ? 1 / Math.sqrt(1 - 2 / rc) : 1,
      uMode: str(params, "colour") === "visible" ? 1 : 0,
      uGrid: bool(params, "grid"),
      uDopplerColor: bool(params, "doppler"),
      uBeaming: bool(params, "doppler"),
      uSkyMode: skyMode === "grid" ? 1 : 0,
      uSkyGain: skyMode === "none" ? 0 : num(params, "skyGain"),
      uSkyRot: skyRotation(num(params, "skyYaw"), 30),
    });
    d.draw();
  }

  onDrag(dx: number, dy: number, p: Params) {
    return {
      azimuth: (((num(p, "azimuth") - dx * 120) % 360) + 360) % 360,
      inclination: Math.max(1, Math.min(179, num(p, "inclination") - dy * 90)),
    };
  }

  onWheel(deltaY: number, p: Params) {
    return { distance: Math.max(20, Math.min(600, num(p, "distance") * Math.exp(deltaY * 0.001))) };
  }

  /** Brightness of the two hot caps over one turn (Beloborodov + Poutanen & Beloborodov 2006). */
  curve(p: Params): SimCurve {
    const { R } = this.geometry(p);
    const grav = bool(p, "gravity");
    const u = grav ? 2 / R : 0;
    const inc = num(p, "inclination") * DEG, chi = num(p, "tilt") * DEG;
    const vEq = (2 * Math.PI * num(p, "radius")) / (num(p, "period") / 1000) / C_KM;
    const beta0 = Math.min(0.95, grav ? vEq / Math.sqrt(1 - u) : vEq);
    const doppler = bool(p, "doppler");
    const key = [u, inc, chi, beta0, doppler].join("|");
    if (key !== this.curveKey) {
      this.curveKey = key;
      const N = 120;
      const values: number[] = [];
      for (let k = 0; k < N; k++) {
        const phase = (2 * Math.PI * k) / N;
        let F = 0;
        for (const [theta, ph] of [[chi, phase], [Math.PI - chi, phase + Math.PI]]) {
          const cosPsi = Math.cos(inc) * Math.cos(theta) + Math.sin(inc) * Math.sin(theta) * Math.cos(ph);
          const cosA = u + (1 - u) * cosPsi;
          if (cosA <= 0) continue;
          let delta = 1;
          if (doppler) {
            const sinPsi = Math.sqrt(Math.max(1e-12, 1 - cosPsi * cosPsi));
            const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
            const beta = beta0 * Math.sin(theta);
            const cosXi = (-sinA * Math.sin(inc) * Math.sin(ph)) / sinPsi;
            delta = 1 / (Math.sqrt(1 / (1 - beta * beta)) * (1 - beta * cosXi));
          }
          F += Math.pow(delta, 5) * cosA;
        }
        values.push(F);
      }
      const max = Math.max(...values, 1e-9);
      this.curveValues = values.map((v) => v / max);
    }
    const az = num(p, "azimuth") * DEG;
    const phase = ((((this.spin - az) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI);
    return { label: "Pulse profile: hot caps' brightness over one turn", values: this.curveValues, marker: phase };
  }

  hud(p: Params): HudItem[] {
    const { M, R } = this.geometry(p);
    const grav = bool(p, "gravity");
    const u = 2 / R;
    const rKm = R * M;
    const gSurface = (6.674e-11 * num(p, "mass") * 1.989e30) / ((rKm * 1000) ** 2 * Math.sqrt(1 - u)) / 9.81;
    const vEq = (2 * Math.PI * rKm) / (num(p, "period") / 1000) / C_KM;
    const slow = 1000 / num(p, "period") / Math.max(num(p, "spinShown"), 1e-6);
    const items: HudItem[] = [
      { label: "Radius", value: `${rKm.toFixed(1)} km · ${(R / 2).toFixed(2)} × its Schwarzschild radius` },
      { label: "Surface you can see", value: !grav ? "half" : visibleFraction(u) >= 0.995 ? "all of it" : `about ${Math.round(100 * visibleFraction(u))}%` },
      { label: "Surface gravity", value: `${gSurface.toExponential(1)} g` },
      { label: "Light from the surface loses", value: grav ? `${Math.round(100 * (1 - Math.sqrt(1 - u)))}% of its energy` : "none" },
      { label: "Equator speed", value: `${vEq.toFixed(3)} c` },
      { label: "Spin shown slowed down by", value: `${slow < 1e4 ? Math.round(slow).toLocaleString("en-US") : slow.toExponential(1)}×` },
    ];
    if (num(p, "radius") / M < 2.25) items.push({ label: "Too compact", value: "it would collapse to a black hole" });
    return items;
  }

  dispose() {
    deleteFBO(this.engine.ctx, this.lut);
    this.bake.dispose();
    this.display.dispose();
  }
}

export const neutronSim: SimulationDescriptor = {
  id: "neutron",
  title: "Neutron Star",
  tagline: "A spinning pulsar whose gravity lets you see its far side",
  description:
    "A neutron star in its own curved spacetime. Every ray from the camera is integrated once into a table (RK4 on the orbit equation) and re-baked when the star or the distance changes; the million-kelvin surface and its hot polar caps are shifted by gravity and by the Doppler effect of the spin.",
  controlsHelp: "Drag: orbit (horizontal = around the spin axis, vertical = viewing angle) · Wheel or pinch: distance",
  params: [
    { key: "mass", label: "Mass", group: "Star", kind: "range", default: 1.4, min: 1, max: 2.3, step: 0.01, unit: "M☉", digits: 2, hint: "Most neutron stars weigh about 1.4 Suns; the heaviest known about 2.1" },
    { key: "radius", label: "Radius", group: "Star", kind: "range", default: 12, min: 7, max: 16, step: 0.1, unit: "km", digits: 1, hint: "About the size of a city. Smaller means more compact, and more light bending." },
    { key: "gravity", label: "Light bending", group: "Star", kind: "toggle", default: true, hint: "Turn off to see the star as if light travelled in straight lines" },
    {
      key: "period", label: "Spin period", group: "Spin", kind: "select", default: "5",
      options: [
        { value: "1.396", label: "1.4 ms: fastest known (716 turns a second)" },
        { value: "5", label: "5 ms: a millisecond pulsar" },
        { value: "33.7", label: "34 ms: the Crab pulsar" },
        { value: "89.3", label: "89 ms: the Vela pulsar" },
        { value: "1000", label: "1 s: a typical pulsar" },
      ],
    },
    { key: "spinShown", label: "Spin shown at", group: "Spin", kind: "range", default: 0.2, min: 0, max: 2, step: 0.01, unit: "turns/s", digits: 2, hint: "The real spin is far too fast to watch" },
    { key: "doppler", label: "Doppler effect of the spin", group: "Spin", kind: "toggle", default: true, hint: "The side turning towards you is brighter and bluer" },
    { key: "tilt", label: "Magnetic axis tilt", group: "Hot caps", kind: "range", default: 50, min: 0, max: 90, step: 0.5, unit: "°", digits: 1, hint: "Angle between the magnetic poles and the spin axis" },
    { key: "capSize", label: "Cap size", group: "Hot caps", kind: "range", default: 18, min: 3, max: 45, step: 0.5, unit: "°", digits: 1 },
    { key: "surfaceTemp", label: "Surface temperature", group: "Hot caps", kind: "range", default: 1, min: 0.2, max: 3, step: 0.05, unit: "MK", digits: 2 },
    { key: "capTemp", label: "Cap temperature", group: "Hot caps", kind: "range", default: 3, min: 0.5, max: 10, step: 0.05, unit: "MK", digits: 2 },
    {
      key: "colour", label: "Colours", group: "View", kind: "select", default: "xray",
      options: [{ value: "xray", label: "X-ray brightness (false colour)" }, { value: "visible", label: "Visible light (true colour)" }],
      hint: "At a million kelvin the star shines mostly in X-rays; in visible light it would look blue-white all over",
    },
    { key: "grid", label: "Surface grid", group: "View", kind: "toggle", default: true, hint: "Latitude and longitude every 30°: count how far round the back you can see" },
    { key: "distance", label: "Distance", group: "Camera", kind: "range", default: 110, min: 20, max: 600, step: 0.5, unit: "km", digits: 1 },
    { key: "inclination", label: "Viewing angle", group: "Camera", kind: "range", default: 70, min: 1, max: 179, step: 0.1, unit: "°", digits: 1, hint: "Angle between your line of sight and the spin axis" },
    { key: "azimuth", label: "Azimuth", group: "Camera", kind: "range", default: 0, min: 0, max: 360, step: 0.1, unit: "°", digits: 1 },
    { key: "fov", label: "Field of view", group: "Camera", kind: "range", default: 40, min: 10, max: 120, step: 0.5, unit: "°", digits: 1 },
    {
      key: "skyMode", label: "Background", group: "Sky", kind: "select", default: "milkyway",
      options: [{ value: "milkyway", label: "Milky Way (NASA)" }, { value: "grid", label: "Lensing grid" }, { value: "none", label: "None" }],
    },
    { key: "skyGain", label: "Sky brightness", group: "Sky", kind: "range", default: 3, min: 0, max: 20, step: 0.05, digits: 2 },
    { key: "skyYaw", label: "Sky rotation", group: "Sky", kind: "range", default: 0, min: -180, max: 180, step: 0.5, unit: "°", digits: 1 },
  ],
  create: (engine) => new NeutronStar(engine),
};
