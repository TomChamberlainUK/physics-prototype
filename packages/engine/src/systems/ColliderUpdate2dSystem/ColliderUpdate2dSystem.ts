import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import System from '../System';
import { computeAABB, computeWorldVertices } from './logic';

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

      collider.aabb = computeAABB(entity);
      collider.worldVertices = computeWorldVertices({ collider, transform });
    }
  }
}
