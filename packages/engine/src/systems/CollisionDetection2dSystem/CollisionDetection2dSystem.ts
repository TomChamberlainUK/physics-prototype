import type Entity from '#/Entity';
import type { Context } from '#/types';
import { getBroadPhasePairs, getNarrowPhasePairs } from './logic';

export default class CollisionDetection2dSystem {
  type = 'physics';

  update(entities: Entity[], context: Context) {
    const filteredEntities = entities.filter(entity => (
      entity.hasComponents(['Collider2d', 'Transform2d'])
    ));
    const candidatePairs = getBroadPhasePairs(filteredEntities);
    const collisionPairs = getNarrowPhasePairs(candidatePairs);
    context.collisionPairs = collisionPairs;
  }
}
