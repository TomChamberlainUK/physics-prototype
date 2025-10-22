import type Entity from '#/Entity';
import type { Transform2dComponent } from '#/components';
import type Renderer from '#/Renderer';
import lerp from '#/utils/lerp';

type Props = {
  alpha?: number;
  narrowPhaseCollisionPairsSet: Map<string, string>;
  renderer: Renderer;
};

export default function renderPotentialCollisionLine(entityA: Entity, entityB: Entity, {
  alpha = 1,
  narrowPhaseCollisionPairsSet,
  renderer,
}: Props) {
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

  const strokeColor = narrowPhaseCollisionPairsSet.get(entityA.id) === entityB.id
    ? `rgb(255, 0, 0)`
    : `rgb(255, 255, 0)`;

  renderer.drawLine({
    start,
    end,
    strokeColor,
  });
}
