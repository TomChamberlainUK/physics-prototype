import type { Collider2dComponent } from '#/components';
import type Entity from '#/Entity';
import System from '../System';
import { getAABB } from './logic';

/**
 * A system that updates the axis-aligned bounding boxes (AABBs) of 2D colliders.
 */
export default class AABBUpdate2dSystem extends System {
  name = 'AABBUpdate2dSystem';
  type = 'physics';

  /**
   * Updates entities' AABBs based on their colliders and transforms.
   * @param entities - The entities to update.
   */
  update(entities: Entity[]): void {
    for (const entity of entities) {
      if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
        continue;
      }
      const collider = entity.getComponent<Collider2dComponent>('Collider2d');
      collider.aabb = getAABB(entity);
    }
  }
}
