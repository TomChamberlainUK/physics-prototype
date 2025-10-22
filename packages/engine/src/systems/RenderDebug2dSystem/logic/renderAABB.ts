import type Entity from '#/Entity';
import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Renderer from '#/Renderer';
import lerp from '#/utils/lerp';

type Props = {
  alpha?: number;
  broadPhaseCollisionPairsSet: Set<string>;
  renderer: Renderer;
};

export default function renderAABB(entity: Entity, {
  alpha = 1,
  broadPhaseCollisionPairsSet,
  renderer,
}: Props) {
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
    ? 'rgba(255, 0, 0, 0.5)'
    : 'rgba(0, 255, 0, 0.5)';

  renderer.drawBox({
    x,
    y,
    width: aabb.max.x - aabb.min.x,
    height: aabb.max.y - aabb.min.y,
    strokeColor,
  });
}
