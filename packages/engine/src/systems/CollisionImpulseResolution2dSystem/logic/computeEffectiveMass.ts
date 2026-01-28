/**
 * Properties required to compute the effective mass.
 */
type Properties = {
  /** The inverse moment of inertia of body A. */
  inverseMomentOfInertiaA: number;
  /** The inverse moment of inertia of body B. */
  inverseMomentOfInertiaB: number;
  /** The torque arm for body A (distance from center of mass to contact point along normal). */
  torqueArmA: number;
  /** The torque arm for body B (distance from center of mass to contact point along normal). */
  torqueArmB: number;
  /** The total inverse mass of both bodies. */
  totalInverseMass: number;
};

/**
 * Computes the effective mass at a contact point between two rigid bodies.
 * @param properties - An object containing the inverse moment of inertia, torque arms, and total inverse mass, see {@link Properties}.
 * @returns The effective mass at the contact point.
 */
export default function computeEffectiveMass({
  inverseMomentOfInertiaA,
  inverseMomentOfInertiaB,
  torqueArmA,
  torqueArmB,
  totalInverseMass,
}: Properties): number {
  const rotationalResistanceA = (torqueArmA ** 2) * inverseMomentOfInertiaA;
  const rotationalResistanceB = (torqueArmB ** 2) * inverseMomentOfInertiaB;
  return totalInverseMass + rotationalResistanceA + rotationalResistanceB;
}
