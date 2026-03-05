import type { Transform2dComponent } from '#src/components/index.js';
import type Entity from '#src/Entity.js';
import { Vector2d } from '#src/maths/index.js';
import System from './System.js';

/**
 * A system that captures a snapshot of the previous 2D transform.
 */
export default class TransformSnapshot2dSystem extends System {
  name = 'TransformSnapshot2dSystem';
  type = 'history';

  /**
   * Captures a snapshot of the previous 2D transform for each entity.
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
