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

/**
 * A system that renders debug information for 2D entities, including colliders and collision pairs.
 */
export default class RenderDebug2dSystem extends System {
  name = 'RenderDebug2dSystem';
  type = 'render';
  /** Tracks the previous state of the 'p' key to toggle debug rendering. */
  #wasPPressed = false;
  /** Indicates whether debug rendering is currently enabled. */
  enabled = true;

  /**
   * Renders debug information for entities, including colliders and collision pairs.
   * @param entities - The entities to render debug information for.
   * @param context - The context containing rendering and input information.
   */
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
