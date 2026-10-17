// Light rays around a non-spinning (Schwarzschild) black hole, in the
// equatorial plane, with G = c = M = 1. With u = 1/r the orbit equation is
//   d²u/dψ² = 3u² − u,
// integrated with RK4. The ray arrives from far to the left at height b
// (the impact parameter) moving in +x; ψ is the angle swept around the hole.

export interface Ray {
  points: Array<[number, number]>;
  captured: boolean;
}

export const CRITICAL_B = Math.sqrt(27);

export const schwarzschildRay = (b: number, xStart: number, rMax: number): Ray => {
  const sign = Math.sign(b) || 1;
  const B = Math.abs(b);
  let psi = Math.atan2(B, -xStart);
  let u = 1 / Math.hypot(xStart, B);
  let w = Math.sqrt(Math.max(0, 1 / (B * B) - u * u + 2 * u * u * u));
  const point = (uu: number, p: number): [number, number] => [-Math.cos(p) / uu, (sign * Math.sin(p)) / uu];
  const points: Array<[number, number]> = [point(u, psi)];
  const h = 0.002;
  const f = (uu: number, ww: number): [number, number] => [ww, 3 * uu * uu - uu];
  for (let n = 1; psi < 6 * Math.PI; n++) {
    const [a1, b1] = f(u, w);
    const [a2, b2] = f(u + (h / 2) * a1, w + (h / 2) * b1);
    const [a3, b3] = f(u + (h / 2) * a2, w + (h / 2) * b2);
    const [a4, b4] = f(u + h * a3, w + h * b3);
    u += (h / 6) * (a1 + 2 * a2 + 2 * a3 + a4);
    w += (h / 6) * (b1 + 2 * b2 + 2 * b3 + b4);
    psi += h;
    if (u >= 0.5) {
      points.push(point(0.5, psi));
      return { points, captured: true };
    }
    if (u <= 0) break;
    if (n % 8 === 0) points.push(point(u, psi));
    if (w < 0 && 1 / u > rMax) break;
  }
  points.push(point(u, psi));
  return { points, captured: false };
};
