import type { Transform2dComponent, RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';
import System from './System';

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

        // Relative velocity at contact (linear + angular)
        const contactVelocityA = rigidBodyA.velocity.add(new Vector2d({
          x: -rigidBodyA.angularVelocity * leverArmA.y,
          y: rigidBodyA.angularVelocity * leverArmA.x,
        }));
        const contactVelocityB = rigidBodyB.velocity.add(new Vector2d({
          x: -rigidBodyB.angularVelocity * leverArmB.y,
          y: rigidBodyB.angularVelocity * leverArmB.x,
        }));
        const relativeVelocity = contactVelocityA.subtract(contactVelocityB);
        const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, normal);

        // Already separating
        if (velocityAlongNormal > 0) {
          continue;
        }

        // Calculate restitution (bounciness)
        const restitution = Math.min(rigidBodyA.restitution, rigidBodyB.restitution);

        // Calculate impulse
        const torqueArmA = Vector2d.crossProduct(leverArmA, normal);
        const torqueArmB = Vector2d.crossProduct(leverArmB, normal);
        const torqueArmASquared = torqueArmA * torqueArmA;
        const torqueArmBSquared = torqueArmB * torqueArmB;
        const inverseMomentOfInertiaA = rigidBodyA.inverseMomentOfInertia ?? 0;
        const inverseMomentOfInertiaB = rigidBodyB.inverseMomentOfInertia ?? 0;
        const effectiveMass = totalInverseMass + (torqueArmASquared) * inverseMomentOfInertiaA + (torqueArmBSquared) * inverseMomentOfInertiaB;
        const impulseMagnitude = (-(1 + restitution) * velocityAlongNormal / effectiveMass) / contactPoints.length;
        const impulse = normal.multiply(impulseMagnitude);

        // Apply impulse to linear velocities
        rigidBodyA.impulse = rigidBodyA.impulse.add(impulse);
        rigidBodyB.impulse = rigidBodyB.impulse.subtract(impulse);

        // Apply impulse to angular velocities
        rigidBodyA.angularImpulse += torqueArmA * impulseMagnitude;
        rigidBodyB.angularImpulse -= torqueArmB * impulseMagnitude;

        // Calculate friction impulse
        const tangent = new Vector2d({ x: -normal.y, y: normal.x }).getUnit();
        const velocityAlongTangent = Vector2d.dotProduct(relativeVelocity, tangent);
        const frictionCoefficient = Math.sqrt(rigidBodyA.friction * rigidBodyB.friction);
        const frictionImpulseMagnitude = -velocityAlongTangent / effectiveMass / contactPoints.length;
        const maxFrictionImpulse = impulseMagnitude * frictionCoefficient;
        const clampedFrictionImpulseMagnitude = Math.max(-maxFrictionImpulse, Math.min(frictionImpulseMagnitude, maxFrictionImpulse));
        const frictionImpulse = tangent.multiply(clampedFrictionImpulseMagnitude);

        // Apply friction impulse to linear velocities
        rigidBodyA.impulse = rigidBodyA.impulse.add(frictionImpulse);
        rigidBodyB.impulse = rigidBodyB.impulse.subtract(frictionImpulse);

        // Apply friction impulse to angular velocities
        const frictionTorqueArmA = Vector2d.crossProduct(leverArmA, tangent);
        const frictionTorqueArmB = Vector2d.crossProduct(leverArmB, tangent);
        rigidBodyA.angularImpulse += frictionTorqueArmA * clampedFrictionImpulseMagnitude;
        rigidBodyB.angularImpulse -= frictionTorqueArmB * clampedFrictionImpulseMagnitude;
      }
    }
  }
}
