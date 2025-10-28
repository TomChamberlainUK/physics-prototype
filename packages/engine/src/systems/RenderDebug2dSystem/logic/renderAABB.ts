import type Entity from '#/Entity';
import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Renderer from '#/Renderer';
import lerp from '#/utils/lerp';

/**
 * Parameters for rendering the AABB.
 */
type Params = {
  /** The interpolation alpha value for rendering. */
  alpha?: number;
  /** The set of entity IDs involved in broad-phase collisions. */
  broadPhaseCollisionPairsSet: Set<string>;
  /** The renderer used to draw the AABB. */
  renderer: Renderer;
};

/**
 * Renders the axis-aligned bounding box (AABB) of the given entity for debugging purposes.
 * @param entity - The entity whose AABB to render.
 * @param params - The parameters for rendering, including alpha, collision pairs set, and renderer.
 */
export default function renderAABB(entity: Entity, {
  alpha = 1,
  broadPhaseCollisionPairsSet,
  renderer,
}: Params) {
  if (!entity.hasComponents(['Transform2d', 'Collider2d'])) {
    return;
  }

  const transform = entity.getComponent<Transform2dComponent>('Transform2d');
  const collider = entity.getComponent<Collider2dComponent>('Collider2d');

  if (!collider.aabb) {
    return;
  }

  const x = lerp(transform.previousPosition.x, transform.position.x, alpha);
  const y = lerp(transform.previousPosition.y, transform.position.y, alpha);

  const { aabb } = collider;
  const strokeColor = broadPhaseCollisionPairsSet.has(entity.id)
    ? 'rgb(255, 0, 0)'
    : 'rgb(0, 255, 0)';

  renderer.drawBox({
    x,
    y,
    width: aabb.max.x - aabb.min.x,
    height: aabb.max.y - aabb.min.y,
    strokeColor,
  });
}
