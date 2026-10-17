// Thin WebGL2 helpers: context creation, programs with reflected uniforms,
// textures and framebuffers. No external dependencies.

export interface GLCaps {
  floatLinear: boolean;
  anisotropy: number;
  maxTexture: number;
  maxCube: number;
  renderer: string;
}

export interface GLContext {
  gl: WebGL2RenderingContext;
  caps: GLCaps;
  /** Empty VAO used for attribute-less full-screen triangles. */
  vao: WebGLVertexArrayObject;
  anisoExt: EXT_texture_filter_anisotropic | null;
}

export function createContext(canvas: HTMLCanvasElement): GLContext {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
  });
  if (!gl) throw new Error("WebGL2 is not available in this browser.");
  if (!gl.getExtension("EXT_color_buffer_float"))
    throw new Error("EXT_color_buffer_float is required (rendering to float textures).");
  const floatLinear = !!gl.getExtension("OES_texture_float_linear");
  const anisoExt = gl.getExtension("EXT_texture_filter_anisotropic");
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const caps: GLCaps = {
    floatLinear,
    anisotropy: anisoExt ? gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1,
    maxTexture: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxCube: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
    renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
  };
  const vao = gl.createVertexArray()!;
  return { gl, caps, vao, anisoExt };
}

export const FULLSCREEN_VS = /* glsl */ `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

type UniformValue = number | boolean | number[] | Float32Array | Int32Array;

interface UniformInfo {
  loc: WebGLUniformLocation;
  type: number;
}

export class Program {
  readonly prog: WebGLProgram;
  private uniforms = new Map<string, UniformInfo>();

  constructor(private ctx: GLContext, fs: string, vs: string = FULLSCREEN_VS) {
    const gl = ctx.gl;
    const v = compile(gl, gl.VERTEX_SHADER, vs);
    const f = compile(gl, gl.FRAGMENT_SHADER, fs);
    const p = gl.createProgram()!;
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error("Program link failed: " + gl.getProgramInfoLog(p));
    }
    gl.deleteShader(v);
    gl.deleteShader(f);
    this.prog = p;
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i)!;
      const name = info.name.replace(/\[0\]$/, "");
      const loc = gl.getUniformLocation(p, info.name);
      if (loc) this.uniforms.set(name, { loc, type: info.type });
    }
  }

  use(): this {
    this.ctx.gl.useProgram(this.prog);
    return this;
  }

  /** Set uniforms by name; types come from program reflection. Unknown names are ignored. */
  set(values: Record<string, UniformValue>): this {
    const gl = this.ctx.gl;
    for (const name in values) {
      const u = this.uniforms.get(name);
      if (!u) continue;
      const v = values[name];
      const arr = typeof v === "number" || typeof v === "boolean" ? null : (v as ArrayLike<number>);
      const s = typeof v === "boolean" ? (v ? 1 : 0) : (v as number);
      switch (u.type) {
        case gl.FLOAT: arr ? gl.uniform1fv(u.loc, arr as Float32Array) : gl.uniform1f(u.loc, s); break;
        case gl.FLOAT_VEC2: gl.uniform2fv(u.loc, arr as Float32Array); break;
        case gl.FLOAT_VEC3: gl.uniform3fv(u.loc, arr as Float32Array); break;
        case gl.FLOAT_VEC4: gl.uniform4fv(u.loc, arr as Float32Array); break;
        case gl.FLOAT_MAT3: gl.uniformMatrix3fv(u.loc, false, arr as Float32Array); break;
        case gl.FLOAT_MAT4: gl.uniformMatrix4fv(u.loc, false, arr as Float32Array); break;
        case gl.INT_VEC2: gl.uniform2iv(u.loc, arr as Int32Array); break;
        case gl.INT_VEC3: gl.uniform3iv(u.loc, arr as Int32Array); break;
        default: gl.uniform1i(u.loc, s); // int, bool, samplers
      }
    }
    return this;
  }

  /** Bind a texture to a unit and point the sampler uniform at it. */
  tex(name: string, unit: number, texture: WebGLTexture | null, target: number = this.ctx.gl.TEXTURE_2D): this {
    const gl = this.ctx.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(target, texture);
    const u = this.uniforms.get(name);
    if (u) gl.uniform1i(u.loc, unit);
    return this;
  }

  draw(): void {
    const gl = this.ctx.gl;
    gl.bindVertexArray(this.ctx.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose(): void {
    this.ctx.gl.deleteProgram(this.prog);
  }
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s) ?? "";
    const numbered = src.split("\n").map((l, i) => `${String(i + 1).padStart(4)}: ${l}`).join("\n");
    console.error(numbered);
    throw new Error("Shader compile failed: " + log);
  }
  return s;
}

export interface TexOptions {
  internalFormat: number;
  format: number;
  type: number;
  filter?: number;
  minFilter?: number;
  wrap?: number;
  wrapS?: number;
  data?: ArrayBufferView | null;
}

export function createTexture(ctx: GLContext, w: number, h: number, o: TexOptions): WebGLTexture {
  const gl = ctx.gl;
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, o.internalFormat, w, h, 0, o.format, o.type, o.data ?? null);
  const f = o.filter ?? gl.NEAREST;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, o.minFilter ?? f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, o.wrapS ?? o.wrap ?? gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, o.wrap ?? gl.CLAMP_TO_EDGE);
  return t;
}

export const fmt = (gl: WebGL2RenderingContext) => ({
  rgba32f: { internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT },
  rgba16f: { internalFormat: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT },
  rg32f: { internalFormat: gl.RG32F, format: gl.RG, type: gl.FLOAT },
  r32f: { internalFormat: gl.R32F, format: gl.RED, type: gl.FLOAT },
  rgba8: { internalFormat: gl.RGBA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE },
});

export interface FBO {
  fb: WebGLFramebuffer;
  textures: WebGLTexture[];
  width: number;
  height: number;
}

export function createFBO(ctx: GLContext, w: number, h: number, specs: TexOptions[]): FBO {
  const gl = ctx.gl;
  const textures = specs.map((s) => createTexture(ctx, w, h, s));
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  textures.forEach((t, i) => gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t, 0));
  gl.drawBuffers(textures.map((_, i) => gl.COLOR_ATTACHMENT0 + i));
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (status !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Framebuffer incomplete: 0x" + status.toString(16));
  return { fb, textures, width: w, height: h };
}

export function deleteFBO(ctx: GLContext, f: FBO | null): void {
  if (!f) return;
  ctx.gl.deleteFramebuffer(f.fb);
  f.textures.forEach((t) => ctx.gl.deleteTexture(t));
}

export function bindFBO(ctx: GLContext, f: FBO | null, w?: number, h?: number): void {
  const gl = ctx.gl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, f ? f.fb : null);
  gl.viewport(0, 0, w ?? f?.width ?? gl.drawingBufferWidth, h ?? f?.height ?? gl.drawingBufferHeight);
}
