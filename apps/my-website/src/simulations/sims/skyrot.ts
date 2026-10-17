import { DEG } from "./types";

/** Column-major mat3 mapping scene directions to sky (galactic) directions: Rz(yaw) * Rx(tilt). */
export function skyRotation(yawDeg: number, tiltDeg: number): Float32Array {
  const cy = Math.cos(yawDeg * DEG), sy = Math.sin(yawDeg * DEG);
  const ct = Math.cos(tiltDeg * DEG), st = Math.sin(tiltDeg * DEG);
  // Rx(t) = [1 0 0; 0 ct -st; 0 st ct],  Rz(y) = [cy -sy 0; sy cy 0; 0 0 1]
  // M = Rz * Rx (row-major) = [cy, -sy*ct, sy*st; sy, cy*ct, -cy*st; 0, st, ct]
  return new Float32Array([cy, sy, 0, -sy * ct, cy * ct, st, sy * st, -cy * st, ct]);
}

/** Column-major mat3 from yaw (about Z) then pitch (about local Y). */
export function yawPitch(yawDeg: number, pitchDeg: number): Float32Array {
  const cy = Math.cos(yawDeg * DEG), sy = Math.sin(yawDeg * DEG);
  const cp = Math.cos(pitchDeg * DEG), sp = Math.sin(pitchDeg * DEG);
  // Rz(yaw) * Ry(pitch); Ry = [cp 0 sp; 0 1 0; -sp 0 cp]
  // row-major: [cy*cp, -sy, cy*sp; sy*cp, cy, sy*sp; -sp, 0, cp]
  return new Float32Array([cy * cp, sy * cp, -sp, -sy, cy, 0, cy * sp, sy * sp, cp]);
}
