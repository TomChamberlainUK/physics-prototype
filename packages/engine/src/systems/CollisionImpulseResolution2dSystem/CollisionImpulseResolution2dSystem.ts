import type { Transform2dComponent, RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';
import { computeEffectiveMass } from './logic';
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

      for (const contactPoint of contactPoints) {
        const totalInverseMass = rigidBodyA.inverseMass + rigidBodyB.inverseMass;

        // Both static
        if (totalInverseMass === 0) {
          continue;
        }

        // Distance from center of mass to contact point
        const leverArmA = contactPoint.subtract(transformA.position);
        const leverArmB = contactPoint.subtract(transformB.position);

        // Rotational velocity at contact point due to angular velocity
        const rotationalVelocityAtContactA = Vector2d.crossProduct(rigidBodyA.angularVelocity, leverArmA);
        const rotationalVelocityAtContactB = Vector2d.crossProduct(rigidBodyB.angularVelocity, leverArmB);

        // Combined velocity at contact point (linear + angular)
        const contactVelocityA = rigidBodyA.velocity.add(rotationalVelocityAtContactA);
        const contactVelocityB = rigidBodyB.velocity.add(rotationalVelocityAtContactB);

        // Relative velocity at contact point
        const relativeVelocity = contactVelocityA.subtract(contactVelocityB);
        const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, normal);

        // Already separating
        if (velocityAlongNormal > 0) {
          continue;
        }

        // Calculate restitution (bounciness)
        const restitution = Math.min(rigidBodyA.restitution, rigidBodyB.restitution);

        // Rotational leverage for normal impulse
        const torqueArmA = Vector2d.crossProduct(leverArmA, normal);
        const torqueArmB = Vector2d.crossProduct(leverArmB, normal);

        // Combined effect of mass and rotational inertia on the impulse
        const effectiveMass = computeEffectiveMass({
          totalInverseMass,
          torqueArmA,
          torqueArmB,
          inverseMomentOfInertiaA: rigidBodyA.inverseMomentOfInertia ?? 0,
          inverseMomentOfInertiaB: rigidBodyB.inverseMomentOfInertia ?? 0,
        });

        // Impulse applied along the contact normal
        const normalImpulseMagnitude = (-(1 + restitution) * velocityAlongNormal / effectiveMass) / contactPoints.length;
        const normalLinearImpulse = normal.multiply(normalImpulseMagnitude);
        const normalAngularImpulseA = torqueArmA * normalImpulseMagnitude;
        const normalAngularImpulseB = torqueArmB * normalImpulseMagnitude;

        // Apply normal impulse to linear velocities
        rigidBodyA.impulse = rigidBodyA.impulse.add(normalLinearImpulse);
        rigidBodyB.impulse = rigidBodyB.impulse.subtract(normalLinearImpulse);

        // Apply normal impulse to angular velocities
        rigidBodyA.angularImpulse += normalAngularImpulseA;
        rigidBodyB.angularImpulse -= normalAngularImpulseB;

        // Tangent direction for friction impulse
        const tangent = new Vector2d({ x: -normal.y, y: normal.x }).getUnit();

        // Calculate friction impulse (resistance to sliding)
        const frictionCoefficient = Math.sqrt(rigidBodyA.friction * rigidBodyB.friction);

        // Rotational leverage for friction impulse
        const frictionTorqueArmA = Vector2d.crossProduct(leverArmA, tangent);
        const frictionTorqueArmB = Vector2d.crossProduct(leverArmB, tangent);

        // Relative velocity along tangent
        const velocityAlongTangent = Vector2d.dotProduct(relativeVelocity, tangent);

        // Impulse applied along the tangent
        const frictionImpulseMagnitude = -velocityAlongTangent / effectiveMass / contactPoints.length;
        const maxFrictionImpulse = normalImpulseMagnitude * frictionCoefficient;
        const clampedFrictionImpulseMagnitude = Math.max(-maxFrictionImpulse, Math.min(frictionImpulseMagnitude, maxFrictionImpulse));
        const frictionLinearImpulse = tangent.multiply(clampedFrictionImpulseMagnitude);
        const frictionAngularImpulseA = frictionTorqueArmA * clampedFrictionImpulseMagnitude;
        const frictionAngularImpulseB = frictionTorqueArmB * clampedFrictionImpulseMagnitude;

        // Apply friction impulse to linear velocities
        rigidBodyA.impulse = rigidBodyA.impulse.add(frictionLinearImpulse);
        rigidBodyB.impulse = rigidBodyB.impulse.subtract(frictionLinearImpulse);

        // Apply friction impulse to angular velocities
        rigidBodyA.angularImpulse += frictionAngularImpulseA;
        rigidBodyB.angularImpulse -= frictionAngularImpulseB;
      }
    }
  }
}
