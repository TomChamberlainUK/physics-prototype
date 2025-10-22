import type Entity from '#/Entity';
import type { Context } from '#/types';
import System from '../System';
import {
  getBroadPhaseCollisionPairsSet,
  getNarrowPhaseCollisionPairsMap,
  renderAABB,
  renderPotentialCollisionLine,
} from './logic';

export default class RenderDebug2dSystem extends System {
  type = 'render';

  update(entities: Entity[], {
    alpha = 1,
    broadPhaseCollisionPairs = [],
    narrowPhaseCollisionPairs = [],
    renderer,
  }: Context) {
    if (!renderer) return;

    const broadPhaseCollisionPairsSet = getBroadPhaseCollisionPairsSet(broadPhaseCollisionPairs);
    const narrowPhaseCollisionPairsMap = getNarrowPhaseCollisionPairsMap(narrowPhaseCollisionPairs);

    for (const entity of entities) {
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
  }
}
