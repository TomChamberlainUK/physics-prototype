import type { Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import System from './System';

/**
 * A system that synchronizes previous positions for 2D transforms to enable interpolation.
 */
export default class InterpolationSync2dSystem extends System {
  name = 'InterpolationSync2dSystem';
  type = 'sync';

  /**
   * Updates previous positions of 2D transforms to match current positions.
   * @param entities - The entities in the system.
   */
  update(entities: Entity[]) {
    for (const entity of entities) {
      if (!entity.hasComponents(['Transform2d'])) {
        continue;
      }
      const transform = entity.getComponent<Transform2dComponent>('Transform2d');
      transform.previousPosition = new Vector2d(transform.position);
      transform.previousRotation = transform.rotation;
    }
  }
}
