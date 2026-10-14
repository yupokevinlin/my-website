// Sky cube maps.
//  * NASA Deep Star Maps (preprocessed by scripts/preprocess-sky.mjs into
//    log2-encoded JPEG cube faces) decoded on the GPU into an HDR
//    R11G11B10F cube map with a full mip chain + anisotropic filtering.
//  * A procedural "other universe" sky for the wormhole, baked once on the GPU.

import { GLContext, Program } from "./gl";

export const FACES = ["px", "nx", "py", "ny", "pz", "nz"] as const;
export const SKY_TIERS = [512, 1024, 2048, 4096] as const;
export type SkyTier = (typeof SKY_TIERS)[number];
const LOG_MIN = -17.5, LOG_MAX = 0.5; // must match preprocess-sky.mjs

const CUBE_DIR_GLSL = /* glsl */ `
vec3 cubeDir(int face, vec2 uv) {
  float sc = uv.x * 2.0 - 1.0, tc = uv.y * 2.0 - 1.0;
  if (face == 0) return vec3(1.0, -tc, -sc);
  if (face == 1) return vec3(-1.0, -tc, sc);
  if (face == 2) return vec3(sc, 1.0, tc);
  if (face == 3) return vec3(sc, -1.0, -tc);
  if (face == 4) return vec3(sc, -tc, 1.0);
  return vec3(-sc, -tc, -1.0);
}`;

const DECODE_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uSrc;
out vec4 o;
void main() {
  vec3 c = texelFetch(uSrc, ivec2(gl_FragCoord.xy), 0).rgb * 255.0;
  vec3 v = exp2(${LOG_MIN.toFixed(3)} + (c - 1.0) / 254.0 * ${(LOG_MAX - LOG_MIN).toFixed(3)});
  o = vec4(mix(vec3(0.0), v, step(0.5, c)), 1.0);
}`;

// Procedural sky of "the other side": dense young star field, a tilted bright
// galactic band with dust lanes and colourful emission nebulae.
const ALIEN_FS = /* glsl */ `#version 300 es
precision highp float;
uniform int uFace;
uniform float uSize;
out vec4 o;
${CUBE_DIR_GLSL}
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
  for (int i = 0; i < 7; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
// One candidate star per lattice cell around the unit sphere; stars sit away
// from cell borders and are ~1 texel wide, so only the containing cell matters.
vec3 starLayer(vec3 d, float scale, float density, float bright) {
  vec3 c = floor(d * scale);
  vec3 h = hash33(c);
  if (h.x > density) return vec3(0.0);
  vec3 sp = normalize(c + 0.2 + 0.6 * hash33(c + 7.7));
  float ang = length(cross(sp, d));
  float s = 1.2 / uSize;
  vec3 tint = mix(vec3(1.0, 0.62, 0.38), vec3(0.62, 0.78, 1.0), h.y);
  return tint * bright * pow(h.z, 5.0) * exp(-ang * ang / (s * s)) * step(0.0, dot(sp, d));
}
// A large face-on-ish spiral galaxy centred on direction gc.
vec3 spiralGalaxy(vec3 d, vec3 gc, vec3 gn, float size) {
  vec3 t1 = normalize(cross(gn, gc)), t2 = cross(gc, t1);
  float z = dot(d, gc);
  if (z <= 0.0) return vec3(0.0);
  vec2 q = vec2(dot(d, t1), dot(d, t2) / 0.55) / (z * size);  // inclined disc
  float rho = length(q);
  float th = atan(q.y, q.x);
  float arms = pow(0.5 + 0.5 * cos(2.0 * (th - 2.6 * log(rho + 0.02))), 3.0);
  float disc = exp(-rho * 3.2);
  float dust = smoothstep(0.35, 0.8, fbm(vec3(q * 6.0, 1.7)));
  float bulge = exp(-rho * rho * 60.0);
  vec3 armCol = mix(vec3(0.55, 0.7, 1.0), vec3(1.0, 0.45, 0.6), smoothstep(0.4, 0.8, fbm(vec3(q * 9.0, 4.0))));
  return disc * (0.25 + arms * (1.0 - 0.7 * dust)) * armCol * 0.6 + bulge * vec3(1.0, 0.85, 0.6) * 2.5;
}
void main() {
  vec3 d = normalize(cubeDir(uFace, gl_FragCoord.xy / uSize));
  // tilted galactic plane of the far-side galaxy we are in
  vec3 n = normalize(vec3(0.35, 0.55, 0.76));
  float b = dot(d, n);
  float band = exp(-b * b * 18.0);
  float core = exp(-pow(length(d - normalize(vec3(0.6, -0.7, 0.2))), 2.0) * 4.0);
  float dust = smoothstep(0.45, 0.78, fbm(d * 5.0 + 3.0));
  vec3 glow = vec3(0.85, 0.85, 1.0) * band * (0.5 + 0.9 * fbm(d * 3.0)) * (1.0 - 0.85 * dust * band);
  glow += vec3(1.0, 0.78, 0.5) * core * 1.6 * (1.0 - 0.6 * dust);
  // emission nebulae
  float neb1 = pow(fbm(d * 2.2 + 11.0), 3.0) * 3.0;
  float neb2 = pow(fbm(d * 3.1 - 5.0), 3.5) * 3.0;
  vec3 neb = neb1 * vec3(1.0, 0.25, 0.45) + neb2 * vec3(0.2, 0.55, 1.0);
  neb *= 0.35 + smoothstep(0.1, 0.7, band + 0.4 * fbm(d * 1.3));
  // neighbouring spiral galaxy: placed where the wormhole looks through (-X)
  vec3 gal = spiralGalaxy(d, normalize(vec3(-1.0, 0.12, 0.08)), normalize(vec3(0.3, 0.2, 1.0)), 0.55);
  vec3 col = glow * 0.03 + neb * 0.03 + gal * 0.05;
  col += starLayer(d, 160.0, 0.45, 0.6);
  col += starLayer(d, 380.0, 0.40, 0.2) * (0.5 + 2.5 * band);
  col += starLayer(d, 900.0, 0.35, 0.05) * (0.3 + 3.0 * band + 2.0 * length(gal));
  col += starLayer(d, 55.0, 0.25, 3.0);
  o = vec4(col, 1.0);
}`;

export class SkyLibrary {
  private decode: Program;
  private milky = new Map<number, Promise<WebGLTexture>>();
  private alienTex: WebGLTexture | null = null;

  constructor(private ctx: GLContext) {
    this.decode = new Program(ctx, DECODE_FS);
  }

  private allocCube(N: number): WebGLTexture {
    const gl = this.ctx.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
    const levels = Math.floor(Math.log2(N)) + 1;
    gl.texStorage2D(gl.TEXTURE_CUBE_MAP, levels, gl.R11F_G11F_B10F, N, N);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (this.ctx.anisoExt)
      gl.texParameterf(gl.TEXTURE_CUBE_MAP, this.ctx.anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, this.ctx.caps.anisotropy));
    return tex;
  }

  private renderToFaces(tex: WebGLTexture, N: number, drawFace: (face: number) => void) {
    const gl = this.ctx.gl;
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    gl.viewport(0, 0, N, N);
    for (let f = 0; f < 6; f++) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, tex, 0);
      drawFace(f);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  }

  /** NASA Milky Way cube map at the given face resolution (cached). */
  milkyWay(tier: SkyTier, onProgress?: (fraction: number) => void): Promise<WebGLTexture> {
    const N = Math.min(tier, this.ctx.caps.maxCube);
    let p = this.milky.get(N);
    if (!p) {
      p = this.loadMilkyWay(N, onProgress);
      this.milky.set(N, p);
      p.catch(() => this.milky.delete(N));
    }
    return p;
  }

  private async loadMilkyWay(N: number, onProgress?: (f: number) => void): Promise<WebGLTexture> {
    const gl = this.ctx.gl;
    let done = 0;
    const bitmaps = await Promise.all(
      FACES.map(async (f) => {
        const res = await fetch(`/ray-tracing/sky/milkyway/${N}/${f}.jpg`);
        if (!res.ok) throw new Error(`Sky face ${f} (${N}) missing: ${res.status}`);
        const bmp = await createImageBitmap(await res.blob(), {
          colorSpaceConversion: "none",
          premultiplyAlpha: "none",
        });
        onProgress?.(++done / 6);
        return bmp;
      }),
    );
    const tex = this.allocCube(N);
    const src = gl.createTexture()!;
    this.renderToFaces(tex, N, (face) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, gl.RGB, gl.UNSIGNED_BYTE, bitmaps[face]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      this.decode.use().tex("uSrc", 0, src).draw();
      bitmaps[face].close();
    });
    gl.deleteTexture(src);
    return tex;
  }

  /** Procedural sky for the far side of the wormhole (baked once). */
  alien(N = 2048): WebGLTexture {
    if (this.alienTex) return this.alienTex;
    const prog = new Program(this.ctx, ALIEN_FS);
    const tex = this.allocCube(N);
    this.renderToFaces(tex, N, (face) => prog.use().set({ uFace: face, uSize: N }).draw());
    prog.dispose();
    this.alienTex = tex;
    return tex;
  }
}

/**
 * Sky sampling helpers. uSkyMode: 0 = cube map, 1 = lensing grid
 * (checkerboard in galactic longitude/latitude, as in aroussel's
 * "GR Schwarzschild black hole" shader).
 */
export const SKY_GLSL = /* glsl */ `
uniform int uSkyMode;
uniform float uSkyGain;
uniform mat3 uSkyRot;
#define PI 3.14159265358979
vec3 lensingGrid(vec3 d) {
  vec2 p = vec2(atan(d.y, d.x) / (2.0 * PI), acos(clamp(d.z, -1.0, 1.0)) / PI);
  vec2 q = sin(PI * p * vec2(24.0, 12.0));
  float m = q.x * q.y;
  float c = clamp(0.5 - m / max(fwidth(m), 1e-4), 0.0, 1.0);
  vec3 a = mix(vec3(0.02, 0.03, 0.06), vec3(0.85, 0.9, 1.0), c);
  // highlight the equator & prime meridian for orientation
  float eq = smoothstep(0.004, 0.0, abs(p.y - 0.5));
  float pm = smoothstep(0.004, 0.0, abs(fract(p.x + 0.5) - 0.5));
  return mix(a, vec3(1.0, 0.35, 0.1), max(eq, pm)) * 0.12;
}
// d: world direction. Always call unconditionally (uses derivatives).
vec3 skyColor(samplerCube tex, vec3 d) {
  d = uSkyRot * d;
  vec3 t = texture(tex, d).rgb;
  vec3 g = lensingGrid(d);
  return (uSkyMode == 1 ? g : t) * uSkyGain;
}
`;
