import type Entity from '#/Entity';
import type { Context } from '#/types';
import System from '../System';
import {
  getBroadPhaseCollisionPairsSet,
  getNarrowPhaseCollisionPairsMap,
  renderAABB,
  renderCollider,
  renderPotentialCollisionLine,
} from './logic';

export default class RenderDebug2dSystem extends System {
  name = 'RenderDebug2dSystem';
  type = 'render';
  #wasPPressed = false;
  enabled = true;

  update(entities: Entity[], {
    alpha = 1,
    broadPhaseCollisionPairs = [],
    input,
    narrowPhaseCollisionPairs = [],
    renderer,
  }: Context) {
    if (input) {
      if (input.isPressed('p') && !this.#wasPPressed) {
        this.enabled = !this.enabled;
        this.#wasPPressed = true;
      }
      else if (!input.isPressed('p')) {
        this.#wasPPressed = false;
      }
    }
    if (!this.enabled || !renderer) return;

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
  }
}
