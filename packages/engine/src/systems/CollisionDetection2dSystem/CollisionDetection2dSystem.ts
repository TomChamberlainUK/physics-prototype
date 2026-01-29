import type Entity from '#/Entity';
import type { Context } from '#/types';
import { findBroadPhasePairs, findNarrowPhasePairs } from './logic';

/**
 * A system that performs collision detection for 2D entities.
 */
export default class CollisionDetection2dSystem {
  name = 'CollisionDetection2dSystem';
  type = 'physics';

  /**
   * Updates collision pairs in the context by performing broad-phase and narrow-phase collision detection.
   * @param entities - The entities to check for collisions.
   * @param context - The context to update with collision pairs.
   */
  update(entities: Entity[], context: Context) {
    const filteredEntities = entities.filter(entity => (
      entity.hasComponents(['Collider2d', 'Transform2d'])
    ));
    const broadPhaseCollisionPairs = findBroadPhasePairs(filteredEntities);
    const narrowPhaseCollisionPairs = findNarrowPhasePairs(broadPhaseCollisionPairs);
    context.broadPhaseCollisionPairs = broadPhaseCollisionPairs;
    context.narrowPhaseCollisionPairs = narrowPhaseCollisionPairs;
  }
}
