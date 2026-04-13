import type Entity from '#src/Entity.js';
import type { Context } from '#src/types/index.js';
import System from '../System.js';
import {
  getBroadPhaseCollisionPairsSet,
  getNarrowPhaseCollisionPairsMap,
  renderAABB,
  renderCollider,
  renderContactPoints,
  renderPotentialCollisionLine,
} from './logic/index.js';

/**
 * A system that renders debug information for 2D entities, including colliders and collision pairs.
 */
export default class RenderDebug2dSystem extends System {
  name = 'RenderDebug2dSystem';
  type = 'render';

  /**
   * Renders debug information for entities, including colliders and collision pairs.
   * @param entities - The entities to render debug information for.
   * @param context - The context containing rendering and input information.
   */
  update(entities: Entity[], {
    alpha = 1,
    broadPhaseCollisionPairs = [],
    narrowPhaseCollisionPairs = [],
    renderer,
    showDebug,
  }: Context) {
    if (!renderer || !showDebug) return;

    const broadPhaseCollisionPairsSet = getBroadPhaseCollisionPairsSet(broadPhaseCollisionPairs);
    const narrowPhaseCollisionPairsMap = getNarrowPhaseCollisionPairsMap(narrowPhaseCollisionPairs);

    for (const entity of entities) {
      renderCollider(entity, {
        alpha,
        renderer,
      });

      renderAABB(entity, {
        alpha,
        broadPhaseCollisionPairsSet,
        renderer,
      });
    }

    for (const [entityA, entityB] of broadPhaseCollisionPairs) {
      renderPotentialCollisionLine(entityA, entityB, {
        alpha,
        narrowPhaseCollisionPairsMap,
        renderer,
      });
    }

    for (const { contactManifold } of narrowPhaseCollisionPairs) {
      const { contactPoints } = contactManifold;
      renderContactPoints(contactPoints, {
        alpha,
        renderer,
      });
    }
  }
}
