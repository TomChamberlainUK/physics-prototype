import type { RigidBody2dComponent } from '#src/components/index.js';
import type Entity from '#src/Entity.js';
import { Vector2d } from '#src/maths/index.js';
import type { Context } from '#src/types/index.js';
import System from './System.js';

/**
 * A system that applies input-based impulses to 2D rigid bodies.
 */
export default class InputImpulseSystem extends System {
  name = 'InputImpulseSystem';
  type = 'physics';

  /**
   * Applies impulses to 2D rigid bodies based on user input.
   * @param entities - The entities in the system.
   * @param context - The context containing input and deltaTime information.
   */
  update(entities: Entity[], { actions, deltaTime }: Context) {
    if (!actions || !deltaTime) return;
    for (const entity of entities) {
      if (!entity.hasComponents(['RigidBody2d', 'InputImpulse'])) {
        continue;
      }
      const rigidBody = entity.getComponent<RigidBody2dComponent>('RigidBody2d');
      let force = 150000; // Assuming 60Hz physics update rate
      const direction = new Vector2d({ x: 0, y: 0 });
      if (actions.isActive('boost')) {
        force *= 2;
      }
      if (actions.isActive('moveUp')) {
        direction.y -= 1;
      }
      if (actions.isActive('moveLeft')) {
        direction.x -= 1;
      }
      if (actions.isActive('moveDown')) {
        direction.y += 1;
      }
      if (actions.isActive('moveRight')) {
        direction.x += 1;
      }
      const normalizedDirection = direction.getUnit();
      const impulse = normalizedDirection.multiply(force * deltaTime);
      rigidBody.impulse = rigidBody.impulse.add(impulse);
    }
  }
}
