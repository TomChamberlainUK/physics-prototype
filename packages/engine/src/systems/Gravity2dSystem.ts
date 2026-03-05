import type { RigidBody2dComponent } from '#src/components/index.js';
import type Entity from '#src/Entity.js';
import { Vector2d } from '#src/maths/index.js';
import System from './System.js';

/**
 * A system that applies gravity to 2D entities with rigid body components.
 */
export default class Gravity2dSystem extends System {
  type = 'physics';
  name = 'Gravity2dSystem';

  /**
   * Applies gravity to 2D entities based on their rigid body components.
   * @param entities - The entities in the system.
   */
  update(entities: Entity[]) {
    for (const entity of entities) {
      if (!entity.hasComponents(['RigidBody2d'])) {
        continue;
      }

      const rigidBody = entity.getComponent<RigidBody2dComponent>('RigidBody2d');
      if (rigidBody.inverseMass === 0) {
        continue;
      }

      const gravity = 9.81; // meters per second squared
      rigidBody.acceleration = rigidBody.acceleration.add(new Vector2d({ x: 0, y: gravity }));
    }
  }
}
