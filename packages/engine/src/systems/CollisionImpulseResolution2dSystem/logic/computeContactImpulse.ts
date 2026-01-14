import Vector2d from '#/maths/Vector2d';
import {
  computeEffectiveMass,
  computeNormalImpulseMagnitude,
  computeTangentImpulseMagnitude,
  clampTangentImpulseMagnitude,
} from '.';

/**
 * Parameter types for computeContactImpulse function.
 */
type Parameters = {
  /** The angular velocity of body A. */
  angularVelocityA: number;
  /** The angular velocity of body B. */
  angularVelocityB: number;
  /** The contact point between the two bodies. */
  contactPoint: Vector2d;
  /** The friction coefficient of body A. */
  frictionA: number;
  /** The friction coefficient of body B. */
  frictionB: number;
  /** The inverse mass of body A. */
  inverseMassA: number;
  /** The inverse mass of body B. */
  inverseMassB: number;
  /** The inverse moment of inertia of body A. */
  inverseMomentOfInertiaA: number;
  /** The inverse moment of inertia of body B. */
  inverseMomentOfInertiaB: number;
  /** The contact normal vector. */
  normal: Vector2d;
  /** The position of body A. */
  positionA: Vector2d;
  /** The position of body B. */
  positionB: Vector2d;
  /** The restitution coefficient of body A. */
  restitutionA: number;
  /** The restitution coefficient of body B. */
  restitutionB: number;
  /** The linear velocity of body A. */
  velocityA: Vector2d;
  /** The linear velocity of body B. */
  velocityB: Vector2d;
};

/**
 * Output types for computeContactImpulse function.
 */
type Output = {
  /** The linear impulse along the contact normal. */
  normalLinearImpulse: Vector2d;
  /** The angular impulse for body A along the contact normal. */
  normalAngularImpulseA: number;
  /** The angular impulse for body B along the contact normal. */
  normalAngularImpulseB: number;
  /** The linear impulse along the contact tangent. */
  tangentLinearImpulse: Vector2d;
  /** The angular impulse for body A along the contact tangent. */
  tangentAngularImpulseA: number;
  /** The angular impulse for body B along the contact tangent. */
  tangentAngularImpulseB: number;
};

/**
 * Computes the contact impulse between two rigid bodies at a single contact point.
 * @param parameters - The conditions for the contact impulse computation, see {@link Parameters}.
 * @returns The computed contact impulse, see {@link Output}, or `null` if no impulse is applied.
 */
export default function computeContactImpulse({
  angularVelocityA,
  angularVelocityB,
  contactPoint,
  frictionA,
  frictionB,
  inverseMassA,
  inverseMassB,
  inverseMomentOfInertiaA,
  inverseMomentOfInertiaB,
  normal,
  positionA,
  positionB,
  restitutionA,
  restitutionB,
  velocityA,
  velocityB,
}: Parameters): Output | null {
  const totalInverseMass = inverseMassA + inverseMassB;
  // Both static
  if (totalInverseMass === 0) {
    return null;
  }

  // Distance from center of mass to contact point
  const leverArmA = contactPoint.subtract(positionA);
  const leverArmB = contactPoint.subtract(positionB);

  // Rotational velocity at contact point due to angular velocity
  const rotationalVelocityAtContactA = Vector2d.crossProduct(angularVelocityA, leverArmA);
  const rotationalVelocityAtContactB = Vector2d.crossProduct(angularVelocityB, leverArmB);

  // Combined velocity at contact point (linear + angular)
  const contactVelocityA = velocityA.add(rotationalVelocityAtContactA);
  const contactVelocityB = velocityB.add(rotationalVelocityAtContactB);

  // Relative velocity at contact point
  const relativeVelocity = contactVelocityA.subtract(contactVelocityB);
  const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, normal);

  // Already separating
  if (velocityAlongNormal > 0) {
    return null;
  }

  // Calculate restitution (bounciness)
  const restitution = Math.min(restitutionA, restitutionB);

  // Rotational leverage for normal impulse
  const normalTorqueArmA = Vector2d.crossProduct(leverArmA, normal);
  const normalTorqueArmB = Vector2d.crossProduct(leverArmB, normal);

  // Combined effect of mass and rotational inertia on the normal impulse
  const normalEffectiveMass = computeEffectiveMass({
    totalInverseMass,
    torqueArmA: normalTorqueArmA,
    torqueArmB: normalTorqueArmB,
    inverseMomentOfInertiaA,
    inverseMomentOfInertiaB,
  });

  // Impulse applied along the contact normal
  const normalImpulseMagnitude = computeNormalImpulseMagnitude({
    effectiveMass: normalEffectiveMass,
    restitution,
    velocity: velocityAlongNormal,
  });

  // Linear and angular components of the normal impulse
  const normalLinearImpulse = normal.multiply(normalImpulseMagnitude);
  const normalAngularImpulseA = normalTorqueArmA * normalImpulseMagnitude;
  const normalAngularImpulseB = normalTorqueArmB * normalImpulseMagnitude;

  // Tangent direction for calculating impulse from friction
  const tangent = new Vector2d({ x: -normal.y, y: normal.x }).getUnit();

  // Calculate friction impulse (resistance to sliding)
  const frictionCoefficient = Math.sqrt(frictionA * frictionB);

  // Rotational leverage for tangent impulse
  const tangentTorqueArmA = Vector2d.crossProduct(leverArmA, tangent);
  const tangentTorqueArmB = Vector2d.crossProduct(leverArmB, tangent);

  // Combined effect of mass and rotational inertia on the tangent impulse
  const tangentEffectiveMass = computeEffectiveMass({
    totalInverseMass,
    torqueArmA: tangentTorqueArmA,
    torqueArmB: tangentTorqueArmB,
    inverseMomentOfInertiaA,
    inverseMomentOfInertiaB,
  });

  // Relative velocity along tangent
  const velocityAlongTangent = Vector2d.dotProduct(relativeVelocity, tangent);

  // Impulse applied along the tangent
  const tangentImpulseMagnitude = computeTangentImpulseMagnitude({
    effectiveMass: tangentEffectiveMass,
    velocity: velocityAlongTangent,
  });

  // Maximum allowable tangent impulse based on friction
  const maxTangentImpulse = normalImpulseMagnitude * frictionCoefficient;
  const clampedTangentImpulseMagnitude = clampTangentImpulseMagnitude({
    tangentImpulseMagnitude,
    maxTangentImpulse,
  });

  // Linear and angular components of the tangent impulse
  const tangentLinearImpulse = tangent.multiply(clampedTangentImpulseMagnitude);
  const tangentAngularImpulseA = tangentTorqueArmA * clampedTangentImpulseMagnitude;
  const tangentAngularImpulseB = tangentTorqueArmB * clampedTangentImpulseMagnitude;

  return {
    normalLinearImpulse,
    normalAngularImpulseA,
    normalAngularImpulseB,
    tangentLinearImpulse,
    tangentAngularImpulseA,
    tangentAngularImpulseB,
  };
}
