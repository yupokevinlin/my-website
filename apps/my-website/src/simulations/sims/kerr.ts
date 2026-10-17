// Kerr black hole physics on the CPU side: horizon / ISCO / photon orbits and
// the static-observer camera tetrad (ported from aroussel's
// "Interstellar video - Black hole" Shadertoy, which follows Mykhailo Moroz's
// approach of integrating Hamilton's equations in Kerr-Schild coordinates).
// Units: G = c = M = 1, signature (-+++).

export function horizonRadius(a: number) {
  return 1 + Math.sqrt(Math.max(0, 1 - a * a));
}

/** Innermost stable circular orbit; prograde (s=+1) or retrograde (s=-1). */
export function iscoRadius(a: number, s: 1 | -1 = 1) {
  const z1 = 1 + Math.cbrt(1 - a * a) * (Math.cbrt(1 + a) + Math.cbrt(1 - a));
  const z2 = Math.sqrt(3 * a * a + z1 * z1);
  return 3 + z2 - s * Math.sqrt((3 - z1) * (3 + z1 + 2 * z2));
}

/** Equatorial circular photon orbit radius. */
export function photonOrbitRadius(a: number, s: 1 | -1 = 1) {
  return 2 * (1 + Math.cos((2 / 3) * Math.acos(-s * a)));
}

/** Angular velocity of the horizon, Omega_H = a / (2 r+). */
export function horizonOmega(a: number) {
  return a / (2 * horizonRadius(a));
}

/** Spheroidal radius r from Kerr-Schild Cartesian coordinates. */
export function rFromCoords(x: number, y: number, z: number, a: number) {
  const rho2 = x * x + y * y + z * z - a * a;
  return Math.sqrt(0.5 * (rho2 + Math.sqrt(rho2 * rho2 + 4 * a * a * z * z)));
}

type Vec4 = [number, number, number, number];
type Mat4 = number[][]; // row-major [i][j]

/** g_{mu nu} = eta + f k k with k_mu = (-1, kx, ky, kz). */
export function metric(pos: Vec4, a: number): Mat4 {
  const [, x, y, z] = pos;
  const r = rFromCoords(x, y, z, a);
  const d = r * r + a * a;
  const k = [-1, (r * x - a * y) / d, (r * y + a * x) / d, z / r];
  const f = (2 * r * r * r) / (r ** 4 + a * a * z * z);
  const eta = [-1, 1, 1, 1];
  return [0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => (i === j ? eta[i] : 0) + f * k[i] * k[j]));
}

function mulMV(m: Mat4, v: Vec4): Vec4 {
  return [0, 1, 2, 3].map((i) => m[i][0] * v[0] + m[i][1] * v[1] + m[i][2] * v[2] + m[i][3] * v[3]) as Vec4;
}
const dot4 = (a: Vec4, b: Vec4) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
const add = (a: Vec4, b: Vec4, s = 1): Vec4 => [a[0] + s * b[0], a[1] + s * b[1], a[2] + s * b[2], a[3] + s * b[3]];
const scale = (a: Vec4, s: number): Vec4 => [a[0] * s, a[1] * s, a[2] * s, a[3] * s];

function invert(m: Mat4): Mat4 {
  const n = 4;
  const a = m.map((r, i) => [...r, ...[0, 1, 2, 3].map((j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r;
    [a[c], a[p]] = [a[p], a[c]];
    const d = a[c][c];
    for (let j = 0; j < 2 * n; j++) a[c][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = a[r][c];
      for (let j = 0; j < 2 * n; j++) a[r][j] -= f * a[c][j];
    }
  }
  return a.map((r) => r.slice(n));
}

function unit(v: Vec4, g: Mat4): Vec4 {
  const n2 = dot4(mulMV(g, v), v);
  return n2 !== 0 ? scale(v, 1 / Math.sqrt(Math.abs(n2))) : v;
}

export interface KerrCamera {
  pos: Vec4;
  /** column-major mat4 with columns E0..E3 (orthonormal tetrad) */
  tetrad: Float32Array;
  /** column-major metric at the camera */
  g: Float32Array;
  /** proper time rate of the static camera vs. coordinate time at infinity */
  lapse: number;
}

/**
 * Static observer at Boyer-Lindquist-like radius R and elevation `incl`
 * above the equatorial plane, azimuth 0 (azimuth is applied at display time
 * thanks to axisymmetry). E1 points radially outward, E3 "up", E2 to the right.
 */
export function kerrCamera(a: number, R: number, incl: number): KerrCamera {
  const x = Math.sqrt(R * R + a * a) * Math.cos(incl);
  const z = R * Math.sin(incl);
  const pos: Vec4 = [0, x, 0, z];
  const g = metric(pos, a);
  const gi = invert(g);
  const time: Vec4 = [1, 0, 0, 0];
  const aim: Vec4 = [0, x, 0, z];
  const vert: Vec4 = scale([0, -x * z, 0, x * x], Math.sign(Math.cos(incl)) || 1);
  const gdot = (u: Vec4, v: Vec4) => dot4(mulMV(g, u), v);
  const E0 = unit(time, g);
  const E1 = unit(add(aim, E0, gdot(aim, E0)), g);
  const E3 = unit(add(add(vert, E1, -gdot(vert, E1)), E0, gdot(vert, E0)), g);
  // Levi-Civita "cross product" of E0, E1, E3 (as in the original shader)
  const c3 = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const d3 = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const sw = (v: Vec4, i: number[]) => i.map((k) => v[k]);
  const YZW = [1, 2, 3], ZWX = [2, 3, 0], WXY = [3, 0, 1], XYZ = [0, 1, 2];
  const eps: Vec4 = [
    d3(sw(E0, YZW), c3(sw(E1, YZW), sw(E3, YZW))),
    -d3(sw(E0, ZWX), c3(sw(E1, ZWX), sw(E3, ZWX))),
    d3(sw(E0, WXY), c3(sw(E1, WXY), sw(E3, WXY))),
    -d3(sw(E0, XYZ), c3(sw(E1, XYZ), sw(E3, XYZ))),
  ];
  const E2 = unit(mulMV(gi, eps), g);
  const tetrad = new Float32Array([...E0, ...E1, ...E2, ...E3]);
  const gcm = new Float32Array(16);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) gcm[j * 4 + i] = g[i][j];
  return { pos, tetrad, g: gcm, lapse: Math.sqrt(Math.max(0, -g[0][0])) };
}
