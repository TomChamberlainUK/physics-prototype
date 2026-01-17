import type { RigidBody2dComponent, Transform2dComponent } from '#/components';
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
  /** The contact point between the two rigid bodies. */
  contactPoint: Vector2d;
  /** The contact normal vector at the contact point. */
  normal: Vector2d;
  /** The transform component for entity A. */
  transformA: Transform2dComponent;
  /** The transform component for entity B. */
  transformB: Transform2dComponent;
  /** The rigid body component for entity A. */
  rigidBodyA: RigidBody2dComponent;
  /** The rigid body component for entity B. */
  rigidBodyB: RigidBody2dComponent;
};

/**
 * Output types for computeContactImpulse function.
 */
type Output = {
  /** The linear impulse along the contact normal. */
  normalLinearImpulse: Vector2d;
  /** The angular impulse for entity A along the contact normal. */
  normalAngularImpulseA: number;
  /** The angular impulse for entity B along the contact normal. */
  normalAngularImpulseB: number;
  /** The linear impulse along the contact tangent. */
  tangentLinearImpulse: Vector2d;
  /** The angular impulse for entity A along the contact tangent. */
  tangentAngularImpulseA: number;
  /** The angular impulse for entity B along the contact tangent. */
  tangentAngularImpulseB: number;
};

/**
 * Computes the contact impulse between two rigid bodies at a single contact point.
 * @param parameters - The components and conditions for the contact impulse computation, see {@link Parameters}.
 * @returns The computed contact impulse, see {@link Output}, or `null` if no impulse is applied.
 */
export default function computeContactPointImpulse({
  contactPoint,
  normal,
  rigidBodyA,
  rigidBodyB,
  transformA,
  transformB,
}: Parameters): Output | null {
  const {
    angularVelocity: angularVelocityA,
    friction: frictionA,
    inverseMass: inverseMassA,
    inverseMomentOfInertia: inverseMomentOfInertiaA,
    restitution: restitutionA,
    velocity: velocityA,
  } = rigidBodyA;

  const {
    angularVelocity: angularVelocityB,
    friction: frictionB,
    inverseMass: inverseMassB,
    inverseMomentOfInertia: inverseMomentOfInertiaB,
    restitution: restitutionB,
    velocity: velocityB,
  } = rigidBodyB;

  const { position: positionA } = transformA;
  const { position: positionB } = transformB;

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
    inverseMomentOfInertiaA: inverseMomentOfInertiaA ?? 0,
    inverseMomentOfInertiaB: inverseMomentOfInertiaB ?? 0,
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
    inverseMomentOfInertiaA: inverseMomentOfInertiaA ?? 0,
    inverseMomentOfInertiaB: inverseMomentOfInertiaB ?? 0,
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
