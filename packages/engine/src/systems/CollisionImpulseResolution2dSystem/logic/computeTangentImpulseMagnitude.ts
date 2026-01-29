/**
 * Properties required to compute the tangent impulse magnitude.
 */
type Properties = {
  /** The effective mass at the contact point. */
  effectiveMass: number;
  /** The relative velocity along the tangent between the two bodies at the contact point. */
  velocity: number;
};

/**
 * Computes the tangent impulse magnitude to be applied during collision resolution.
 * @param properties - An object containing the effective mass and relative velocity, see {@link Properties}.
 * @returns The tangent impulse magnitude.
 */
export default function computeTangentImpulseMagnitude({
  effectiveMass,
  velocity,
}: Properties): number {
  return -velocity / effectiveMass;
}
