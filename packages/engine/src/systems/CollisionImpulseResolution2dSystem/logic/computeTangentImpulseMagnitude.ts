/**
 * Parameters required to compute the tangent impulse magnitude.
 */
type Parameters = {
  /** The effective mass at the contact point. */
  effectiveMass: number;
  /** The relative velocity along the tangent between the two bodies at the contact point. */
  velocity: number;
};

/**
 * Computes the tangent impulse magnitude to be applied during collision resolution.
 * @param effectiveMass - The effective mass at the contact point.
 * @param velocity - The relative velocity along the tangent between the two bodies at the contact point.
 * @returns The tangent impulse magnitude.
 */
export default function computeTangentImpulseMagnitude({
  effectiveMass,
  velocity,
}: Parameters) {
  return -velocity / effectiveMass;
}
