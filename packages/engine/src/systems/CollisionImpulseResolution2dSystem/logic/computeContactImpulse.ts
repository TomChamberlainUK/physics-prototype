import Vector2d from '#/maths/Vector2d';
import {
  computeEffectiveMass,
  computeNormalImpulseMagnitude,
  computeTangentImpulseMagnitude,
  clampTangentImpulseMagnitude,
} from '.';

type Parameters = {
  angularVelocityA: number;
  angularVelocityB: number;
  contactPoint: Vector2d;
  frictionA: number;
  frictionB: number;
  inverseMassA: number;
  inverseMassB: number;
  inverseMomentOfInertiaA: number;
  inverseMomentOfInertiaB: number;
  normal: Vector2d;
  positionA: Vector2d;
  positionB: Vector2d;
  restitutionA: number;
  restitutionB: number;
  velocityA: Vector2d;
  velocityB: Vector2d;
};

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
}: Parameters) {
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
