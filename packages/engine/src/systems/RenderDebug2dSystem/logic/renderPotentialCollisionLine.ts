import type Entity from '#src/Entity.js';
import type { Transform2dComponent } from '#src/components/index.js';
import type Renderer from '#src/Renderer.js';
import { lerp } from '#src/utils/index.js';

/**
 * Parameters for rendering the potential collision line.
 */
type Params = {
  /** The interpolation alpha value for rendering. */
  alpha?: number;
  /** The map of narrow-phase collision pairs. */
  narrowPhaseCollisionPairsMap: Map<string, Set<string>>;
  /** The renderer used to draw the potential collision line. */
  renderer: Renderer;
};

/**
 * Renders a line between two entities to indicate potential collisions for debugging purposes.
 * @param entityA - The first entity.
 * @param entityB - The second entity.
 * @param params - The parameters for rendering, including alpha, collision pairs map, and renderer.
 */
export default function renderPotentialCollisionLine(entityA: Entity, entityB: Entity, {
  alpha = 1,
  narrowPhaseCollisionPairsMap,
  renderer,
}: Params) {
  if (
    !entityA.hasComponent('Transform2d')
    || !entityB.hasComponent('Transform2d')
  ) return;
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

  const start = {
    x: lerp(transformA.previousPosition.x, transformA.position.x, alpha),
    y: lerp(transformA.previousPosition.y, transformA.position.y, alpha),
  };

  const end = {
    x: lerp(transformB.previousPosition.x, transformB.position.x, alpha),
    y: lerp(transformB.previousPosition.y, transformB.position.y, alpha),
  };

  const strokeColor = narrowPhaseCollisionPairsMap.get(entityA.id)?.has(entityB.id)
    ? `rgb(255, 0, 0)`
    : `rgb(255, 255, 0)`;

  renderer.drawLine({
    start,
    end,
    strokeColor,
  });
}
