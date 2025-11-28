import type { RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';
import System from './System';

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
      if (actions.has('boost')) {
        force *= 2;
      }
      if (actions.has('moveUp')) {
        direction.y -= 1;
      }
      if (actions.has('moveLeft')) {
        direction.x -= 1;
      }
      if (actions.has('moveDown')) {
        direction.y += 1;
      }
      if (actions.has('moveRight')) {
        direction.x += 1;
      }
      const normalizedDirection = direction.getUnit();
      const impulse = normalizedDirection.multiply(force * rigidBody.inverseMass * deltaTime);
      rigidBody.impulse = rigidBody.impulse.add(impulse);
    }
  }
}
