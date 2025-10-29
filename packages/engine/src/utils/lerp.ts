/**
 * Performs linear interpolation between two values.
 * @param a - The start value.
 * @param b - The end value.
 * @param t - The interpolation factor (0 to 1).
 * @returns The interpolated value.
 */
export default function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
