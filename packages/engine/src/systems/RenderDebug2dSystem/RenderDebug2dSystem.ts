import type Entity from '#/Entity';
import type { Context } from '#/types';
import System from '../System';
import { getBroadPhaseCollisionPairsSet, renderAABB } from './logic';

export default class RenderDebug2dSystem extends System {
  type = 'render';

  update(entities: Entity[], {
    alpha = 1,
    broadPhaseCollisionPairs = [],
    renderer,
  }: Context) {
    if (!renderer) return;

    const broadPhaseCollisionPairsSet = getBroadPhaseCollisionPairsSet(broadPhaseCollisionPairs);

    for (const entity of entities) {
      renderAABB(entity, {
        alpha,
        broadPhaseCollisionPairsSet,
        renderer,
      });
    }
  }
}
