// HDR post-processing: physically-motivated bloom (dual-filter mip chain,
// Jimenez 13-tap downsample with Karis averaging on the first level, tent
// upsample) followed by exposure + ACES filmic tone mapping + dithering.

import { FBO, GLContext, Program, bindFBO, createFBO, deleteFBO } from "./gl";

const DOWN_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uTexel;     // 1 / source size
uniform int uKaris;
in vec2 vUv;
out vec4 o;
vec3 t(vec2 off) { return texture(uSrc, vUv + off * uTexel).rgb; }
float w(vec3 c) { return 1.0 / (1.0 + dot(c, vec3(0.2126, 0.7152, 0.0722))); }
void main() {
  vec3 a = t(vec2(-2, 2)), b = t(vec2(0, 2)), c = t(vec2(2, 2));
  vec3 d = t(vec2(-2, 0)), e = t(vec2(0, 0)), f = t(vec2(2, 0));
  vec3 g = t(vec2(-2, -2)), h = t(vec2(0, -2)), i = t(vec2(2, -2));
  vec3 j = t(vec2(-1, 1)), k = t(vec2(1, 1)), l = t(vec2(-1, -1)), m = t(vec2(1, -1));
  vec3 g0 = (a + b + d + e) * 0.25, g1 = (b + c + e + f) * 0.25;
  vec3 g2 = (d + e + g + h) * 0.25, g3 = (e + f + h + i) * 0.25;
  vec3 g4 = (j + k + l + m) * 0.25;
  vec3 col;
  if (uKaris == 1) {
    float w0 = w(g0), w1 = w(g1), w2 = w(g2), w3 = w(g3), w4 = w(g4);
    col = (g0 * w0 * 0.125 + g1 * w1 * 0.125 + g2 * w2 * 0.125 + g3 * w3 * 0.125 + g4 * w4 * 0.5)
        / (w0 * 0.125 + w1 * 0.125 + w2 * 0.125 + w3 * 0.125 + w4 * 0.5);
  } else {
    col = (g0 + g1 + g2 + g3) * 0.125 + g4 * 0.5;
  }
  o = vec4(max(col, 0.0), 1.0);
}`;

const UP_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform float uRadius;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 r = uTexel * uRadius;
  vec3 s = texture(uSrc, vUv + vec2(-r.x, r.y)).rgb + texture(uSrc, vUv + vec2(r.x, r.y)).rgb
         + texture(uSrc, vUv + vec2(-r.x, -r.y)).rgb + texture(uSrc, vUv + vec2(r.x, -r.y)).rgb;
  s += 2.0 * (texture(uSrc, vUv + vec2(0, r.y)).rgb + texture(uSrc, vUv + vec2(0, -r.y)).rgb
            + texture(uSrc, vUv + vec2(r.x, 0)).rgb + texture(uSrc, vUv + vec2(-r.x, 0)).rgb);
  s += 4.0 * texture(uSrc, vUv).rgb;
  o = vec4(s / 16.0, 1.0);
}`;

const COMPOSITE_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uHdr;
uniform sampler2D uBloom;
uniform float uExposure;
uniform float uBloomStrength;
uniform float uBloomNorm;   // 1 / number of accumulated mip levels
uniform int uTonemap;   // 0 ACES, 1 Reinhard, 2 linear clip
uniform float uFrame;
in vec2 vUv;
out vec4 o;
vec3 aces(vec3 x) {
  // Stephen Hill's fit of the ACES RRT+ODT
  const mat3 IN = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
  const mat3 OUT = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
  x = IN * x;
  vec3 a = x * (x + 0.0245786) - 0.000090537;
  vec3 b = x * (0.983729 * x + 0.4329510) + 0.238081;
  return clamp(OUT * (a / b), 0.0, 1.0);
}
vec3 toSRGB(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uFrame * 0.618) * 43758.5453); }
void main() {
  vec3 hdr = texelFetch(uHdr, ivec2(gl_FragCoord.xy), 0).rgb;
  vec3 bloom = texture(uBloom, vUv).rgb * uBloomNorm;
  vec3 c = mix(hdr, bloom, uBloomStrength) * uExposure;
  if (uTonemap == 0) c = aces(c);
  else if (uTonemap == 1) c = c / (1.0 + c);
  else c = clamp(c, 0.0, 1.0);
  c = toSRGB(c);
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;   // dither against banding
  o = vec4(c, 1.0);
}`;

export interface PostParams {
  exposureEV: number;
  bloomStrength: number;
  bloomRadius: number;
  tonemap: number;
}

export class PostFX {
  hdr: FBO | null = null;
  private mips: FBO[] = [];
  private down: Program;
  private up: Program;
  private comp: Program;
  width = 0;
  height = 0;
  private frame = 0;

  constructor(private ctx: GLContext) {
    this.down = new Program(ctx, DOWN_FS);
    this.up = new Program(ctx, UP_FS);
    this.comp = new Program(ctx, COMPOSITE_FS);
  }

  resize(w: number, h: number) {
    if (w === this.width && h === this.height) return;
    const gl = this.ctx.gl;
    this.width = w;
    this.height = h;
    deleteFBO(this.ctx, this.hdr);
    this.mips.forEach((m) => deleteFBO(this.ctx, m));
    const spec = { internalFormat: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT, filter: gl.LINEAR };
    this.hdr = createFBO(this.ctx, w, h, [spec]);
    this.mips = [];
    let mw = w, mh = h;
    for (let i = 0; i < 8 && mw > 8 && mh > 8; i++) {
      mw = Math.max(1, mw >> 1);
      mh = Math.max(1, mh >> 1);
      this.mips.push(createFBO(this.ctx, mw, mh, [spec]));
    }
  }

  /** Bloom + tonemap from `hdr` to the default framebuffer. */
  composite(p: PostParams) {
    const gl = this.ctx.gl;
    if (!this.hdr) return;
    gl.disable(gl.BLEND);
    // downsample chain
    let src = this.hdr;
    this.down.use();
    this.mips.forEach((dst, i) => {
      bindFBO(this.ctx, dst);
      this.down.set({ uTexel: [1 / src.width, 1 / src.height], uKaris: i === 0 ? 1 : 0 }).tex("uSrc", 0, src.textures[0]).draw();
      src = dst;
    });
    // upsample + accumulate
    this.up.use();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    for (let i = this.mips.length - 1; i > 0; i--) {
      const s = this.mips[i], d = this.mips[i - 1];
      bindFBO(this.ctx, d);
      this.up.set({ uTexel: [1 / s.width, 1 / s.height], uRadius: p.bloomRadius }).tex("uSrc", 0, s.textures[0]).draw();
    }
    gl.disable(gl.BLEND);
    // composite to screen
    bindFBO(this.ctx, null, this.width, this.height);
    this.comp.use()
      .set({
        uExposure: Math.pow(2, p.exposureEV),
        uBloomStrength: p.bloomStrength,
        uBloomNorm: 1 / Math.max(1, this.mips.length),
        uTonemap: p.tonemap,
        uFrame: this.frame++ % 1024,
      })
      .tex("uHdr", 0, this.hdr.textures[0])
      .tex("uBloom", 1, this.mips[0].textures[0])
      .draw();
  }

  dispose() {
    deleteFBO(this.ctx, this.hdr);
    this.mips.forEach((m) => deleteFBO(this.ctx, m));
    [this.down, this.up, this.comp].forEach((p) => p.dispose());
  }
}
