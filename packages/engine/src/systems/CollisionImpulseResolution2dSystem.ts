import type { RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';
import System from './System';

export default class CollisionImpulseResolution2dSystem extends System {
  type = 'physics';

  update(_entities: Entity[], {
    narrowPhaseCollisionPairs,
  }: Context) {
    if (!narrowPhaseCollisionPairs) return;
    const filteredCollisionPairs = narrowPhaseCollisionPairs.filter(({ entityA, entityB }) => (
      entityA.hasComponents(['RigidBody2d']) && entityB.hasComponents(['RigidBody2d'])
    ));
    for (const { entityA, entityB, normal } of filteredCollisionPairs) {
      const rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
      const rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');

      const totalInverseMass = rigidBodyA.inverseMass + rigidBodyB.inverseMass;
      if (totalInverseMass === 0) continue; // Both static

      // Calculate relative velocity
      const relativeVelocity = rigidBodyA.velocity.subtract(rigidBodyB.velocity);
      const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, normal);

      if (velocityAlongNormal > 0) continue; // Already separating

      // Calculate restitution (bounciness)
      const restitution = Math.min(rigidBodyA.restitution, rigidBodyB.restitution);

      // Calculate impulse scalar
      const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / totalInverseMass;
      const impulse = normal.multiply(impulseMagnitude);

      // Apply impulse to velocities
      rigidBodyA.impulse = rigidBodyA.impulse.add(impulse.multiply(rigidBodyA.inverseMass));
      rigidBodyB.impulse = rigidBodyB.impulse.subtract(impulse.multiply(rigidBodyB.inverseMass));
    }
  }
}
