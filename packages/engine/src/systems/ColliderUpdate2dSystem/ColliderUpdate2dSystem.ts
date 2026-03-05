import type { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import type Entity from '#src/Entity.js';
import System from '../System.js';
import { computeAABB, computeWorldVertices } from './logic/index.js';

/**
 * A system that updates colliders based on their transforms.
 */
export default class ColliderUpdate2dSystem extends System {
  name = 'ColliderUpdate2dSystem';
  type = 'physics';

  /**
   * Updates entities' colliders based on their transforms.
   * @param entities - The entities to update.
   */
  update(entities: Entity[]): void {
    for (const entity of entities) {
      if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
        continue;
      }

      const collider = entity.getComponent<Collider2dComponent>('Collider2d');
      const transform = entity.getComponent<Transform2dComponent>('Transform2d');

      collider.aabb = computeAABB({ collider, transform });
      collider.worldVertices = computeWorldVertices({ collider, transform });
    }
  }
}
