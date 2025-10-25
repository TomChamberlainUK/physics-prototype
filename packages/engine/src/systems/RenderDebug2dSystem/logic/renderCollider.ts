import { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import type Renderer from '#/Renderer';
import { lerp } from '#/utils';

type Props = {
  alpha?: number;
  renderer: Renderer;
};

export default function renderCollider(entity: Entity, {
  alpha = 1,
  renderer,
}: Props) {
  if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
    return;
  }

  const transform = entity.getComponent<Transform2dComponent>('Transform2d');
  const collider = entity.getComponent<Collider2dComponent>('Collider2d');

  const x = lerp(
    transform.previousPosition.x,
    transform.position.x,
    alpha,
  );
  const y = lerp(
    transform.previousPosition.y,
    transform.position.y,
    alpha,
  );

  const strokeColor = 'rgb(255, 255, 0)';

  switch (collider.shape.type) {
    case 'box': {
      const { width, height } = collider.shape;
      renderer.drawBox({
        x,
        y,
        width,
        height,
        strokeColor,
      });
      break;
    }
    case 'circle': {
      const { radius } = collider.shape;
      renderer.drawCircle({
        x,
        y,
        radius,
        strokeColor,
      });
      break;
    }
  }
}
