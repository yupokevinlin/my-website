// GLSL shared by the simulations that shift the colour and brightness of
// starlight: the light speed trip and the fall into a black hole. Both need
// SPECTRUM_GLSL and the uniforms uDopplerColor, uBeaming.

/**
 * Doppler shifts by a factor D (observed / emitted frequency) for an extended
 * source (radiance) and for a point star. For a blackbody,
 * D^3 B_(nu/D)(T) = B_nu(D T), so the shift is just a change of temperature.
 */
export const DOPPLER_GLSL = /* glsl */ `
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
`;

/**
 * Procedural 3D field of nearby stars, traced with a DDA through a lattice in
 * the stars' rest frame (one candidate star per cell), so they stream past
 * with real parallax. Requires DOPPLER_GLSL and the uniforms below.
 */
export const STARFIELD_GLSL = /* glsl */ `
uniform ivec3 uCellBase;
uniform vec3 uCellFrac;
uniform float uDensity;
uniform int uMaxCells;

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

// d: rest-frame direction the light came from; sigmaRest: angular size of a
// pixel in the rest frame; D: Doppler factor of the light along d.
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
`;
