/**
 * Parameters required to clamp the tangent impulse magnitude.
 */
type Parameters = {
  /** The computed tangent impulse magnitude. */
  tangentImpulseMagnitude: number;
  /** The maximum allowable tangent impulse based on friction. */
  maxTangentImpulse: number;
};

/**
 * Clamps the tangent impulse magnitude to be within the maximum allowable tangent impulse.
 * @param tangentImpulseMagnitude - The computed tangent impulse magnitude.
 * @param maxTangentImpulse - The maximum allowable tangent impulse based on friction.
 * @returns The clamped tangent impulse magnitude.
 */
export default function clampTangentImpulseMagnitude({
  tangentImpulseMagnitude,
  maxTangentImpulse,
}: Parameters): number {
  return Math.max(-maxTangentImpulse, Math.min(tangentImpulseMagnitude, maxTangentImpulse));
}
