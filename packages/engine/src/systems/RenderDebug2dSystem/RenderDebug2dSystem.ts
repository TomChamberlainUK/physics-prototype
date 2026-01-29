import type { Events } from '#/core';
import type Entity from '#/Entity';
import type { Context } from '#/types';
import System from '../System';
import {
  getBroadPhaseCollisionPairsSet,
  getNarrowPhaseCollisionPairsMap,
  renderAABB,
  renderCollider,
  renderContactPoints,
  renderPotentialCollisionLine,
} from './logic';

/**
 * Constructor parameters for RenderDebug2dSystem.
 */
type ConstructorParams = {
  /** Event emitter to listen for toggleDebug events. */
  events: Events;
};

/**
 * A system that renders debug information for 2D entities, including colliders and collision pairs.
 */
export default class RenderDebug2dSystem extends System {
  name = 'RenderDebug2dSystem';
  type = 'render';
  /** Indicates whether debug rendering is currently enabled. */
  enabled = true;

  constructor({ events }: ConstructorParams) {
    super();
    events.on('toggleDebug', () => {
      this.enabled = !this.enabled;
    });
  }

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
  }: Context) {
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

    for (const { contactManifold } of narrowPhaseCollisionPairs) {
      const { contactPoints } = contactManifold;
      renderContactPoints(contactPoints, {
        alpha,
        renderer,
      });
    }
  }
}
