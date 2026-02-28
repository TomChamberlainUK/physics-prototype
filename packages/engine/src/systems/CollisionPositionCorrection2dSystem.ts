import { RigidBody2dComponent, Transform2dComponent } from '#src/components/index.js';
import type Entity from '#src/Entity.js';
import type { Context } from '#src/types/index.js';
import System from './System.js';

/**
 * A system that corrects positions of 2D entities to resolve collisions.
 */
export default class CollisionPositionCorrection2dSystem extends System {
  name = 'CollisionPositionCorrection2dSystem';
  type = 'physics';

  /**
   * Corrects positions of 2D entities based on narrow phase collision pairs.
   * @param _entities - The entities in the system (not used).
   * @param context - The context containing narrow phase collision pairs.
   */
  update(_entities: Entity[], {
    narrowPhaseCollisionPairs,
  }: Context) {
    if (!narrowPhaseCollisionPairs) return;
    const filteredCollisionPairs = narrowPhaseCollisionPairs.filter(({ entityA, entityB }) => (
      entityA.hasComponents(['RigidBody2d', 'Transform2d']) && entityB.hasComponents(['RigidBody2d', 'Transform2d'])
    ));
    for (const { entityA, entityB, contactManifold } of filteredCollisionPairs) {
      const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
      const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');
      const rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
      const rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');

      const { normal, overlap } = contactManifold;

      const totalInverseMass = rigidBodyA.inverseMass + rigidBodyB.inverseMass;

      if (totalInverseMass === 0) continue; // Both static

      const correction = normal.multiply(overlap / totalInverseMass);

      transformA.position = transformA.position.add(correction.multiply(rigidBodyA.inverseMass));
      transformB.position = transformB.position.subtract(correction.multiply(rigidBodyB.inverseMass));
    }
  }
}
