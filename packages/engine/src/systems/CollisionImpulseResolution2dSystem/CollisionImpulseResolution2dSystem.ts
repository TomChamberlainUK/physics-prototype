import type { Transform2dComponent, RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import type { Context } from '#/types';
import { computeContactManifoldImpulse } from './logic';
import System from '../System';

/**
 * A system that resolves collision impulses between 2D rigid bodies.
 */
export default class CollisionImpulseResolution2dSystem extends System {
  name = 'CollisionImpulseResolution2dSystem';
  type = 'physics';

  /**
   * Resolves collision impulses for 2D rigid bodies based on narrow phase collision pairs.
   * @param _entities - The entities in the system (not used).
   * @param context - The context containing narrow phase collision pairs.
   */
  update(_entities: Entity[], {
    narrowPhaseCollisionPairs,
  }: Context) {
    if (!narrowPhaseCollisionPairs) return;
    const filteredCollisionPairs = narrowPhaseCollisionPairs.filter(({ entityA, entityB }) => (
      entityA.hasComponents(['RigidBody2d']) && entityB.hasComponents(['RigidBody2d'])
    ));
    for (const { entityA, entityB, contactManifold } of filteredCollisionPairs) {
      const rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
      const rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');
      const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
      const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

      const { normal, contactPoints } = contactManifold;

      const {
        normalLinearImpulse,
        normalAngularImpulseA,
        normalAngularImpulseB,
        tangentLinearImpulse,
        tangentAngularImpulseA,
        tangentAngularImpulseB,
      } = computeContactManifoldImpulse({
        angularVelocityA: rigidBodyA.angularVelocity,
        angularVelocityB: rigidBodyB.angularVelocity,
        contactPoints,
        frictionA: rigidBodyA.friction,
        frictionB: rigidBodyB.friction,
        inverseMassA: rigidBodyA.inverseMass,
        inverseMassB: rigidBodyB.inverseMass,
        inverseMomentOfInertiaA: rigidBodyA.inverseMomentOfInertia ?? 0,
        inverseMomentOfInertiaB: rigidBodyB.inverseMomentOfInertia ?? 0,
        normal,
        positionA: transformA.position,
        positionB: transformB.position,
        restitutionA: rigidBodyA.restitution,
        restitutionB: rigidBodyB.restitution,
        velocityA: rigidBodyA.velocity,
        velocityB: rigidBodyB.velocity,
      });

      // Apply normal impulse to linear velocities
      rigidBodyA.impulse = rigidBodyA.impulse.add(normalLinearImpulse);
      rigidBodyB.impulse = rigidBodyB.impulse.subtract(normalLinearImpulse);

      // Apply normal impulse to angular velocities
      rigidBodyA.angularImpulse += normalAngularImpulseA;
      rigidBodyB.angularImpulse -= normalAngularImpulseB;

      // Apply tangent impulse to linear velocities
      rigidBodyA.impulse = rigidBodyA.impulse.add(tangentLinearImpulse);
      rigidBodyB.impulse = rigidBodyB.impulse.subtract(tangentLinearImpulse);

      // Apply tangent impulse to angular velocities
      rigidBodyA.angularImpulse += tangentAngularImpulseA;
      rigidBodyB.angularImpulse -= tangentAngularImpulseB;
    }
  }
}
