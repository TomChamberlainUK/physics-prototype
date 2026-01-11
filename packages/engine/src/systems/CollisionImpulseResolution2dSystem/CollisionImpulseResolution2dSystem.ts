import type { Transform2dComponent, RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';
import { computeContactImpulse } from './logic';
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

      let totalNormalLinearImpulse = new Vector2d({ x: 0, y: 0 });
      let totalNormalAngularImpulseA = 0;
      let totalNormalAngularImpulseB = 0;
      let totalTangentLinearImpulse = new Vector2d({ x: 0, y: 0 });
      let totalTangentAngularImpulseA = 0;
      let totalTangentAngularImpulseB = 0;

      for (const contactPoint of contactPoints) {
        const contactImpulse = computeContactImpulse({
          angularVelocityA: rigidBodyA.angularVelocity,
          angularVelocityB: rigidBodyB.angularVelocity,
          contactPoint,
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

        if (!contactImpulse) {
          continue;
        }

        const {
          normalLinearImpulse,
          normalAngularImpulseA,
          normalAngularImpulseB,
          tangentLinearImpulse,
          tangentAngularImpulseA,
          tangentAngularImpulseB,
        } = contactImpulse;

        totalNormalLinearImpulse = totalNormalLinearImpulse.add(normalLinearImpulse);
        totalNormalAngularImpulseA += normalAngularImpulseA;
        totalNormalAngularImpulseB += normalAngularImpulseB;
        totalTangentLinearImpulse = totalTangentLinearImpulse.add(tangentLinearImpulse);
        totalTangentAngularImpulseA += tangentAngularImpulseA;
        totalTangentAngularImpulseB += tangentAngularImpulseB;
      }

      if (contactPoints.length > 0) {
        totalNormalLinearImpulse = totalNormalLinearImpulse.divide(contactPoints.length);
        totalNormalAngularImpulseA /= contactPoints.length;
        totalNormalAngularImpulseB /= contactPoints.length;
        totalTangentLinearImpulse = totalTangentLinearImpulse.divide(contactPoints.length);
        totalTangentAngularImpulseA /= contactPoints.length;
        totalTangentAngularImpulseB /= contactPoints.length;
      }

      // Apply normal impulse to linear velocities
      rigidBodyA.impulse = rigidBodyA.impulse.add(totalNormalLinearImpulse);
      rigidBodyB.impulse = rigidBodyB.impulse.subtract(totalNormalLinearImpulse);

      // Apply normal impulse to angular velocities
      rigidBodyA.angularImpulse += totalNormalAngularImpulseA;
      rigidBodyB.angularImpulse -= totalNormalAngularImpulseB;

      // Apply tangent impulse to linear velocities
      rigidBodyA.impulse = rigidBodyA.impulse.add(totalTangentLinearImpulse);
      rigidBodyB.impulse = rigidBodyB.impulse.subtract(totalTangentLinearImpulse);

      // Apply tangent impulse to angular velocities
      rigidBodyA.angularImpulse += totalTangentAngularImpulseA;
      rigidBodyB.angularImpulse -= totalTangentAngularImpulseB;
    }
  }
}
