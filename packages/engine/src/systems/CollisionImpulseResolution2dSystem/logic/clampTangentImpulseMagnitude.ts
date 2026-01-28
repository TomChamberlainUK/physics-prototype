/**
 * Properties required to clamp the tangent impulse magnitude.
 */
type Properties = {
  /** The computed tangent impulse magnitude. */
  tangentImpulseMagnitude: number;
  /** The maximum allowable tangent impulse based on friction. */
  maxTangentImpulse: number;
};

/**
 * Clamps the tangent impulse magnitude to be within the maximum allowable tangent impulse.
 * @param properties - An object containing the tangent impulse magnitude and the maximum allowable tangent impulse, see {@link Properties}.
 * @returns The clamped tangent impulse magnitude.
 */
export default function clampTangentImpulseMagnitude({
  tangentImpulseMagnitude,
  maxTangentImpulse,
}: Properties): number {
  return Math.max(-maxTangentImpulse, Math.min(tangentImpulseMagnitude, maxTangentImpulse));
}
