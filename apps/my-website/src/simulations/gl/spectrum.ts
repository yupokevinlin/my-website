// Precomputed colour science used by the shaders.
//
//  * Planck LUT: linear-sRGB colour of a blackbody of temperature T, integrated
//    against the CIE 1931 2-degree observer (multi-lobe Gaussian fit of
//    Wyman, Sloan & Shirley 2013). Stored as chromaticity (rgb / Y) + log10(Y),
//    so it interpolates smoothly over 5 decades of temperature.
//    Normalised so that Y(6500 K) = 1.
//
//  * Inverse LUT: blackbody temperature from the colour ratio ln(b/r), used to
//    reinterpret sky pixels as blackbody spectra for relativistic Doppler.
//
// Key identity used for Doppler shifts and beaming: for a blackbody,
//     D^3 * B_(nu/D)(T) = B_nu(D*T)
// so a Doppler factor D just multiplies the temperature.

import { GLContext, createTexture } from "./gl";

export const PLANCK_N = 1024;
export const PLANCK_LOG_MIN = 2.0; // log10 T
export const PLANCK_LOG_MAX = 7.5;
export const INV_N = 512;

function g(x: number, mu: number, s1: number, s2: number) {
  const t = (x - mu) / (x < mu ? s1 : s2);
  return Math.exp(-0.5 * t * t);
}
function cie(lambdaNm: number): [number, number, number] {
  const l = lambdaNm;
  const X = 1.056 * g(l, 599.8, 37.9, 31.0) + 0.362 * g(l, 442.0, 16.0, 26.7) - 0.065 * g(l, 501.1, 20.4, 26.2);
  const Y = 0.821 * g(l, 568.8, 46.9, 40.5) + 0.286 * g(l, 530.9, 16.3, 31.1);
  const Z = 1.217 * g(l, 437.0, 11.8, 36.0) + 0.681 * g(l, 459.0, 26.0, 13.8);
  return [X, Y, Z];
}

/** Planck spectral radiance (arbitrary constant factor). */
function planckLambda(lambdaM: number, T: number) {
  const c2 = 1.438776877e-2; // m K
  return 1 / (Math.pow(lambdaM * 1e6, 5) * Math.expm1(c2 / (lambdaM * T)));
}

/** Linear sRGB (D65) of a blackbody at temperature T, un-normalised. */
export function blackbodyRGB(T: number): [number, number, number] {
  let X = 0, Y = 0, Z = 0;
  for (let l = 360; l <= 830; l += 2) {
    const b = planckLambda(l * 1e-9, T);
    const [x, y, z] = cie(l);
    X += x * b; Y += y * b; Z += z * b;
  }
  const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  const gg = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  const bb = 0.0557 * X - 0.204 * Y + 1.057 * Z;
  return [r, gg, bb];
}

export interface SpectrumLUTs {
  planck: WebGLTexture; // RGBA32F, PLANCK_N x 1: chroma.rgb, log10(Y)
  inverse: WebGLTexture; // R32F, INV_N x 1: log10(T) as function of ln(b/r)
  invRange: [number, number];
}

export function buildSpectrumLUTs(ctx: GLContext): SpectrumLUTs {
  const gl = ctx.gl;
  const ref = blackbodyRGB(6500);
  const refY = 0.2126 * ref[0] + 0.7152 * ref[1] + 0.0722 * ref[2];

  const data = new Float32Array(PLANCK_N * 4);
  for (let i = 0; i < PLANCK_N; i++) {
    const logT = PLANCK_LOG_MIN + ((PLANCK_LOG_MAX - PLANCK_LOG_MIN) * i) / (PLANCK_N - 1);
    const [r, gg, b] = blackbodyRGB(Math.pow(10, logT)).map((v) => v / refY);
    const Y = Math.max(0.2126 * r + 0.7152 * gg + 0.0722 * b, 1e-300);
    data[i * 4] = Math.max(r, 0) / Y;
    data[i * 4 + 1] = Math.max(gg, 0) / Y;
    data[i * 4 + 2] = Math.max(b, 0) / Y;
    data[i * 4 + 3] = Math.max(Math.log10(Y), -60);
  }
  const planck = createTexture(ctx, PLANCK_N, 1, {
    internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT, data,
  });

  // inverse: ln(b/r) is monotonic in T. Sample T densely, then invert.
  const lo = 3.0, hi = 6.0; // log10 T 1000 K .. 1e6 K
  const samples: [number, number][] = [];
  for (let i = 0; i <= 4000; i++) {
    const logT = lo + ((hi - lo) * i) / 4000;
    const [r, , b] = blackbodyRGB(Math.pow(10, logT));
    samples.push([Math.log(Math.max(b, 1e-30) / Math.max(r, 1e-30)), logT]);
  }
  const mMin = samples[0][0], mMax = samples[samples.length - 1][0];
  const inv = new Float32Array(INV_N);
  let k = 0;
  for (let i = 0; i < INV_N; i++) {
    const m = mMin + ((mMax - mMin) * i) / (INV_N - 1);
    while (k < samples.length - 2 && samples[k + 1][0] < m) k++;
    const [m0, t0] = samples[k], [m1, t1] = samples[k + 1];
    inv[i] = t0 + ((t1 - t0) * (m - m0)) / Math.max(m1 - m0, 1e-12);
  }
  const inverse = createTexture(ctx, INV_N, 1, {
    internalFormat: gl.R32F, format: gl.RED, type: gl.FLOAT, data: inv,
  });
  return { planck, inverse, invRange: [mMin, mMax] };
}

/** GLSL helpers matching the LUT layout. Requires uniforms uPlanck, uPlanckInv, uInvRange. */
export const SPECTRUM_GLSL = /* glsl */ `
uniform sampler2D uPlanck;
uniform sampler2D uPlanckInv;
uniform vec2 uInvRange;

float luminance(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// returns chroma (rgb/Y) in .rgb and log10(Y) in .a
vec4 planckRaw(float T) {
  float x = (log2(max(T, 1.0)) * 0.30102999566 - ${PLANCK_LOG_MIN.toFixed(4)}) / ${(PLANCK_LOG_MAX - PLANCK_LOG_MIN).toFixed(4)} * ${(PLANCK_N - 1).toFixed(1)};
  x = clamp(x, 0.0, ${(PLANCK_N - 1).toFixed(1)});
  int i = int(floor(x));
  int j = min(i + 1, ${PLANCK_N - 1});
  return mix(texelFetch(uPlanck, ivec2(i, 0), 0), texelFetch(uPlanck, ivec2(j, 0), 0), x - float(i));
}
// linear sRGB radiance of a blackbody at T (Y(6500K) = 1)
vec3 planck(float T) {
  vec4 p = planckRaw(T);
  return p.rgb * exp2(p.a * 3.32192809489);
}
// blackbody temperature whose colour ratio matches c
float colourTemperature(vec3 c) {
  float m = log(max(c.b, 1e-12) / max(c.r, 1e-12));
  float x = clamp((m - uInvRange.x) / (uInvRange.y - uInvRange.x), 0.0, 1.0) * ${(INV_N - 1).toFixed(1)};
  int i = int(floor(x));
  int j = min(i + 1, ${INV_N - 1});
  float lt = mix(texelFetch(uPlanckInv, ivec2(i, 0), 0).r, texelFetch(uPlanckInv, ivec2(j, 0), 0).r, x - float(i));
  return exp2(lt * 3.32192809489);
}
`;
