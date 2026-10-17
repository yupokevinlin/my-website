// Owns the WebGL context, render resolution, shared resources (sky cube maps,
// spectral LUTs, post-processing) and the animation loop.

import { GLContext, Program, createContext } from "./gl";
import { CONSTRAINED_MAX_PIXELS, CONSTRAINED_MAX_SKY, isConstrainedDevice } from "./device";
import { PostFX } from "./postfx";
import { SKY_TIERS, SkyLibrary, SkyTier } from "./sky";
import { SpectrumLUTs, buildSpectrumLUTs } from "./spectrum";
import type { ParamDef, Params, Simulation, SimStatus } from "../sims/types";

export const RESOLUTIONS: Record<string, [number, number] | null> = {
  "2160p": [3840, 2160],
  "1440p": [2560, 1440],
  "1080p": [1920, 1080],
  "720p": [1280, 720],
  window: null,
};

/** Output settings shared by every simulation. */
export const GLOBAL_PARAMS: ParamDef[] = [
  {
    key: "resolution", label: "Render resolution", group: "Output", kind: "select", default: "2160p",
    options: [
      { value: "2160p", label: "4K UHD (3840×2160)" },
      { value: "1440p", label: "QHD (2560×1440)" },
      { value: "1080p", label: "Full HD (1920×1080)" },
      { value: "720p", label: "HD (1280×720)" },
      { value: "window", label: "Match window" },
    ],
    hint: "Internal render size. Snapshots are saved at this resolution. Phones and tablets render at most at screen size, up to about 1080p.",
  },
  {
    key: "skyTier", label: "Star map detail", group: "Output", kind: "select", default: "4096",
    options: [
      { value: "4096", label: "Ultra: 4096² faces (45 MB)" },
      { value: "2048", label: "High: 2048² faces (11 MB)" },
      { value: "1024", label: "Medium: 1024² faces (2 MB)" },
    ],
    hint: "NASA SVS Deep Star Maps 2020, preprocessed into HDR cube maps. Phones and tablets are limited to High.",
  },
  { key: "exposure", label: "Exposure", group: "Output", kind: "range", default: 0, min: -6, max: 8, step: 0.05, unit: "EV", digits: 2 },
  { key: "bloom", label: "Bloom", group: "Output", kind: "range", default: 0.06, min: 0, max: 0.4, step: 0.005, digits: 3 },
  { key: "bloomRadius", label: "Bloom radius", group: "Output", kind: "range", default: 1, min: 0.5, max: 2.5, step: 0.05, digits: 2 },
  {
    key: "tonemap", label: "Tone mapping", group: "Output", kind: "select", default: "0",
    options: [{ value: "0", label: "ACES filmic" }, { value: "1", label: "Reinhard" }, { value: "2", label: "Linear (clip)" }],
  },
  { key: "timeScale", label: "Time speed", group: "Output", kind: "range", default: 1, min: 0, max: 4, step: 0.05, unit: "×", digits: 2 },
];

/** Output defaults for phones and tablets (see device.ts): render at the screen's size, with the High star map. */
export const CONSTRAINED_DEFAULTS: Params = { resolution: "window", skyTier: "2048" };

export interface EngineStats {
  fps: number;
  width: number;
  height: number;
  status: SimStatus | null;
  skyLoading: string | null;
  renderer: string;
}

export class Engine {
  readonly ctx: GLContext;
  readonly post: PostFX;
  readonly sky: SkyLibrary;
  readonly spectrum: SpectrumLUTs;
  /** Best currently-loaded Milky Way cube map. */
  skyTex: WebGLTexture | null = null;
  private skyTexTier = 0;
  private skyRequested = 0;
  private skyLoading: string | null = null;

  width = 0;
  height = 0;
  private raf = 0;
  private time = 0;
  private last = 0;
  private fps = 60;
  private snapshotResolve: ((b: Blob) => void) | null = null;
  private lost = false;
  /** Size of the on-screen stage in device pixels (used by the "window" resolution). */
  windowSize: [number, number] = [1280, 720];
  /** Phone or tablet: render size and star map detail are capped, whatever the settings ask for. */
  readonly constrained = isConstrainedDevice();

  constructor(readonly canvas: HTMLCanvasElement) {
    this.ctx = createContext(canvas);
    this.post = new PostFX(this.ctx);
    this.sky = new SkyLibrary(this.ctx);
    this.spectrum = buildSpectrumLUTs(this.ctx);
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.lost = true;
    });
  }

  get gl() {
    return this.ctx.gl;
  }

  /** Bind the spectral LUTs used by SPECTRUM_GLSL starting at texture unit `unit`. */
  bindSpectrum(p: Program, unit: number): number {
    p.tex("uPlanck", unit, this.spectrum.planck).tex("uPlanckInv", unit + 1, this.spectrum.inverse);
    p.set({ uInvRange: this.spectrum.invRange });
    return unit + 2;
  }

  setResolution(key: string, windowSize: [number, number]) {
    let [w, h] = RESOLUTIONS[key] ?? windowSize;
    const max = this.ctx.caps.maxTexture;
    if (w > max || h > max) {
      const s = max / Math.max(w, h);
      w = Math.floor(w * s);
      h = Math.floor(h * s);
    }
    if (this.constrained) {
      // never larger than the screen, so the first size on a phone is its final one
      if (w * h > windowSize[0] * windowSize[1]) [w, h] = windowSize;
      if (w * h > CONSTRAINED_MAX_PIXELS) {
        const s = Math.sqrt(CONSTRAINED_MAX_PIXELS / (w * h));
        w = Math.floor(w * s);
        h = Math.floor(h * s);
      }
    }
    w = Math.max(16, Math.round(w));
    h = Math.max(16, Math.round(h));
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.post.resize(w, h);
  }

  /** Progressive sky loading: a small tier first for instant display, then the requested one. */
  requestSky(tierKey: string) {
    const cap = this.constrained ? Math.min(CONSTRAINED_MAX_SKY, this.ctx.caps.maxCube) : this.ctx.caps.maxCube;
    const tier = Math.min(Number(tierKey) || 2048, cap) as SkyTier;
    if (tier === this.skyRequested) return;
    this.skyRequested = tier;
    const chain = SKY_TIERS.filter((t) => t <= tier && (t === 512 || t === tier));
    (async () => {
      for (const t of chain) {
        if (t <= this.skyTexTier && this.skyTexTier <= tier) continue;
        this.skyLoading = `Loading ${t}² star map…`;
        try {
          const tex = await this.sky.milkyWay(t, (f) => (this.skyLoading = `Loading ${t}² star map… ${Math.round(f * 100)}%`));
          if (this.skyRequested !== tier) return; // superseded
          this.skyTex = tex;
          this.skyTexTier = t;
        } catch (err) {
          console.error(err);
          this.skyLoading = `Star map failed to load (${t})`;
          return;
        }
      }
      // tier lowered: switch down immediately (cached)
      if (this.skyTexTier > tier) {
        this.skyTex = await this.sky.milkyWay(tier);
        this.skyTexTier = tier;
      }
      this.skyLoading = null;
    })();
  }

  start(sim: Simulation, getParams: () => Params, onStats: (s: EngineStats) => void) {
    this.stop();
    this.last = performance.now();
    let statsTimer = 0;
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      if (this.lost) return;
      const params = getParams();
      // output settings are applied here so they can never go stale
      this.setResolution(String(params.resolution ?? "2160p"), this.windowSize);
      this.requestSky(String(params.skyTier ?? "2048"));
      const rawDt = Math.max(0, Math.min(0.1, (now - this.last) / 1000));
      this.last = now;
      this.fps = this.fps * 0.92 + (rawDt > 0 ? 1 / rawDt : 60) * 0.08;
      const dt = rawDt * Number(params.timeScale ?? 1);
      this.time += dt;

      sim.render(params, { time: this.time, dt, width: this.width, height: this.height });
      this.post.composite({
        exposureEV: Number(params.exposure ?? 0),
        bloomStrength: Number(params.bloom ?? 0),
        bloomRadius: Number(params.bloomRadius ?? 1),
        tonemap: Number(params.tonemap ?? 0),
      });
      if (this.snapshotResolve) this.captureSnapshot();

      if (now - statsTimer > 250) {
        statsTimer = now;
        onStats({
          fps: this.fps,
          width: this.width,
          height: this.height,
          status: sim.status?.() ?? null,
          skyLoading: this.skyLoading,
          renderer: this.ctx.caps.renderer,
        });
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  /** Resolves with a PNG of the next rendered frame at full render resolution. */
  snapshot(): Promise<Blob> {
    return new Promise((resolve) => (this.snapshotResolve = resolve));
  }

  private captureSnapshot() {
    const gl = this.gl;
    const { width: w, height: h } = this;
    const px = new Uint8Array(w * h * 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const resolve = this.snapshotResolve!;
    this.snapshotResolve = null;
    // flip rows (GL origin is bottom-left)
    const img = new ImageData(w, h);
    const row = w * 4;
    for (let y = 0; y < h; y++) img.data.set(px.subarray((h - 1 - y) * row, (h - y) * row), y * row);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.putImageData(img, 0, 0);
    c.toBlob((b) => b && resolve(b), "image/png");
  }

  dispose() {
    this.stop();
    this.post.dispose();
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
