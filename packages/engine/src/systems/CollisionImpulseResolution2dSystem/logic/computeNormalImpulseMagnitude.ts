/**
 * Properties required to compute the normal impulse magnitude.
 */
type Properties = {
  /** The effective mass at the contact point. */
  effectiveMass: number;
  /** The restitution coefficient (bounciness) of the collision. */
  restitution: number;
  /** The relative velocity along the normal between the two bodies at the contact point. */
  velocity: number;
};

/**
 * Computes the normal impulse magnitude to be applied during collision resolution.
 * @param properties - An object containing the effective mass, restitution, and relative velocity, see {@link Properties}.
 * @returns The normal impulse magnitude.
 */
export default function computeNormalImpulseMagnitude({
  effectiveMass,
  restitution,
  velocity,
}: Properties): number {
  return -(1 + restitution) * velocity / effectiveMass;
}
