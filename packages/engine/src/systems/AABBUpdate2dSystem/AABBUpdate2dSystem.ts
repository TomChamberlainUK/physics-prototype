import type { Collider2dComponent } from '#/components';
import type Entity from '#/Entity';
import System from '../System';
import { getAABB } from './logic';

export default class AABBUpdate2dSystem extends System {
  name = 'AABBUpdate2dSystem';
  type = 'physics';

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
