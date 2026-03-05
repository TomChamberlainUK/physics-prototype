import type { RigidBody2dComponent, Transform2dComponent } from '#src/components/index.js';
import { Vector2d } from '#src/maths/index.js';
import type { ContactManifold } from '#src/types/index.js';
import computeContactPointImpulse from './computeContactPointImpulse.js';

/**
 * Properties required to compute the contact manifold impulse.
 */
type Properties = {
  /** The contact manifold between the two rigid bodies. */
  contactManifold: ContactManifold;
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
 * Output types for computeContactManifoldImpulse.
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
 * @param properties - An object containing the transform and rigid body components for both entities and the contact manifold, see {@link Properties}.
 * @returns The computed contact manifold impulse, see {@link Output}.
 */
export default function computeContactManifoldImpulse({
  contactManifold,
  rigidBodyA,
  rigidBodyB,
  transformA,
  transformB,
}: Properties): Output {
  const { contactPoints, normal } = contactManifold;

  let normalLinearImpulse = new Vector2d({ x: 0, y: 0 });
  let normalAngularImpulseA = 0;
  let normalAngularImpulseB = 0;
  let tangentLinearImpulse = new Vector2d({ x: 0, y: 0 });
  let tangentAngularImpulseA = 0;
  let tangentAngularImpulseB = 0;

  for (const contactPoint of contactPoints) {
    const contactImpulse = computeContactPointImpulse({
      contactPoint,
      normal,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
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
