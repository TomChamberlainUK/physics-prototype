import type { Collider2dComponent } from '#/components';
import type Entity from '#/Entity';
import System from '../System';
import { getAABB, getWorldVertices } from './logic';

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

      collider.worldVertices = getWorldVertices(entity);
      collider.aabb = getAABB(entity);
    }
  }
}
