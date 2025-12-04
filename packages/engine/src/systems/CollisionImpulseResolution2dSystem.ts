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

        // Vectors from center of mass to contact point
        const vectorToContactA = contactPoint.subtract(transformA.position);
        const vectorToContactB = contactPoint.subtract(transformB.position);

        // Relative velocity at contact (linear + angular)
        const velocityAtContactA = rigidBodyA.velocity.add(new Vector2d({
          x: -rigidBodyA.angularVelocity * vectorToContactA.y,
          y: rigidBodyA.angularVelocity * vectorToContactA.x,
        }));
        const velocityAtContactB = rigidBodyB.velocity.add(new Vector2d({
          x: -rigidBodyB.angularVelocity * vectorToContactB.y,
          y: rigidBodyB.angularVelocity * vectorToContactB.x,
        }));
        const relativeVelocity = velocityAtContactA.subtract(velocityAtContactB);
        const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, normal);

        // Already separating
        if (velocityAlongNormal > 0) {
          continue;
        }

        // Calculate restitution (bounciness)
        const restitution = Math.min(rigidBodyA.restitution, rigidBodyB.restitution);

        // Calculate impulse
        const vectorToContactANormalCrossProduct = Vector2d.crossProduct(vectorToContactA, normal);
        const vectorToContactBNormalCrossProduct = Vector2d.crossProduct(vectorToContactB, normal);
        const vectorToContactANormalCrossProductSquared = vectorToContactANormalCrossProduct * vectorToContactANormalCrossProduct;
        const vectorToContactBNormalCrossProductSquared = vectorToContactBNormalCrossProduct * vectorToContactBNormalCrossProduct;
        const inverseMomentOfInertiaA = rigidBodyA.inverseMomentOfInertia ?? 0;
        const inverseMomentOfInertiaB = rigidBodyB.inverseMomentOfInertia ?? 0;
        const denominator = totalInverseMass + (vectorToContactANormalCrossProductSquared) * inverseMomentOfInertiaA + (vectorToContactBNormalCrossProductSquared) * inverseMomentOfInertiaB;
        const impulseMagnitude = (-(1 + restitution) * velocityAlongNormal / denominator) / contactPoints.length;
        const impulse = normal.multiply(impulseMagnitude);

        // Apply impulse to linear velocities
        rigidBodyA.impulse = rigidBodyA.impulse.add(impulse);
        rigidBodyB.impulse = rigidBodyB.impulse.subtract(impulse);

        // Apply impulse to angular velocities
        rigidBodyA.angularImpulse += vectorToContactANormalCrossProduct * impulseMagnitude;
        rigidBodyB.angularImpulse -= vectorToContactBNormalCrossProduct * impulseMagnitude;

        // Calculate friction impulse
        const tangent = new Vector2d({ x: -normal.y, y: normal.x }).getUnit();
        const velocityAlongTangent = Vector2d.dotProduct(relativeVelocity, tangent);
        const frictionCoefficient = Math.sqrt(rigidBodyA.friction * rigidBodyB.friction);
        const frictionImpulseMagnitude = -velocityAlongTangent / denominator / contactPoints.length;
        const maxFrictionImpulse = impulseMagnitude * frictionCoefficient;
        const clampedFrictionImpulseMagnitude = Math.max(-maxFrictionImpulse, Math.min(frictionImpulseMagnitude, maxFrictionImpulse));
        const frictionImpulse = tangent.multiply(clampedFrictionImpulseMagnitude);

        // Apply friction impulse to linear velocities
        rigidBodyA.impulse = rigidBodyA.impulse.add(frictionImpulse);
        rigidBodyB.impulse = rigidBodyB.impulse.subtract(frictionImpulse);

        // Apply friction impulse to angular velocities
        const vectorToContactATangentCrossProduct = Vector2d.crossProduct(vectorToContactA, tangent);
        const vectorToContactBTangentCrossProduct = Vector2d.crossProduct(vectorToContactB, tangent);
        rigidBodyA.angularImpulse += vectorToContactATangentCrossProduct * clampedFrictionImpulseMagnitude;
        rigidBodyB.angularImpulse -= vectorToContactBTangentCrossProduct * clampedFrictionImpulseMagnitude;
      }
    }
  }
}
