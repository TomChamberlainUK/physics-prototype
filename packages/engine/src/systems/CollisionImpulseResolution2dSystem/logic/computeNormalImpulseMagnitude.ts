/**
 * Parameters required to compute the normal impulse magnitude.
 */
type Parameters = {
  /** The effective mass at the contact point. */
  effectiveMass: number;
  /** The restitution coefficient (bounciness) of the collision. */
  restitution: number;
  /** The relative velocity along the normal between the two bodies at the contact point. */
  velocity: number;
};

/**
 * Computes the normal impulse magnitude to be applied during collision resolution.
 * @param effectiveMass - The effective mass at the contact point.
 * @param restitution - The restitution coefficient (bounciness) of the collision.
 * @param velocity - The relative velocity along the normal between the two bodies at the contact point.
 * @returns The normal impulse magnitude.
 */
export default function computeNormalImpulseMagnitude({
  effectiveMass,
  restitution,
  velocity,
}: Parameters): number {
  return -(1 + restitution) * velocity / effectiveMass;
}
