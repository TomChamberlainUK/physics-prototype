import { Vector2d } from '#/maths';
import computeContactImpulse from './computeContactImpulse';

/**
 * Parameter types for computeContactImpulse.
 */
type Parameters = {
  /** The angular velocity of body A. */
  angularVelocityA: number;
  /** The angular velocity of body B. */
  angularVelocityB: number;
  /** The contact points between the two bodies. */
  contactPoints: Vector2d[];
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
  /** The velocity of body A. */
  velocityA: Vector2d;
  /** The velocity of body B. */
  velocityB: Vector2d;
};

/**
 * Output types for computeContactImpulse.
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
 * Computes the contact manifold impulse by averaging the impulses computed at each contact point.
 * @param parameters - The conditions for the contact manifold impulse computation, see {@link Parameters}.
 * @returns The computed contact manifold impulse, see {@link Output}.
 */
export default function computeContactManifoldImpulse({
  angularVelocityA,
  angularVelocityB,
  contactPoints,
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
}: Parameters): Output {
  let normalLinearImpulse = new Vector2d({ x: 0, y: 0 });
  let normalAngularImpulseA = 0;
  let normalAngularImpulseB = 0;
  let tangentLinearImpulse = new Vector2d({ x: 0, y: 0 });
  let tangentAngularImpulseA = 0;
  let tangentAngularImpulseB = 0;

  for (const contactPoint of contactPoints) {
    const contactImpulse = computeContactImpulse({
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
    });

    if (!contactImpulse) {
      continue;
    }

    normalLinearImpulse = normalLinearImpulse.add(contactImpulse.normalLinearImpulse);
    normalAngularImpulseA += contactImpulse.normalAngularImpulseA;
    normalAngularImpulseB += contactImpulse.normalAngularImpulseB;
    tangentLinearImpulse = tangentLinearImpulse.add(contactImpulse.tangentLinearImpulse);
    tangentAngularImpulseA += contactImpulse.tangentAngularImpulseA;
    tangentAngularImpulseB += contactImpulse.tangentAngularImpulseB;
  }

  if (contactPoints.length > 1) {
    normalLinearImpulse = normalLinearImpulse.divide(contactPoints.length);
    normalAngularImpulseA /= contactPoints.length;
    normalAngularImpulseB /= contactPoints.length;
    tangentLinearImpulse = tangentLinearImpulse.divide(contactPoints.length);
    tangentAngularImpulseA /= contactPoints.length;
    tangentAngularImpulseB /= contactPoints.length;
  }

  return {
    normalLinearImpulse,
    normalAngularImpulseA,
    normalAngularImpulseB,
    tangentLinearImpulse,
    tangentAngularImpulseA,
    tangentAngularImpulseB,
  };
}
