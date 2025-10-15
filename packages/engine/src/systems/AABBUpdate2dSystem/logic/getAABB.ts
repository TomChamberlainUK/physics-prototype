import type Entity from '#/Entity';
import type { Collider2dComponent, Transform2dComponent } from '#/index';

export default function getAABB(entity: Entity) {
  if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
    return null;
  }

  const collider = entity.getComponent<Collider2dComponent>('Collider2d');
  const transform = entity.getComponent<Transform2dComponent>('Transform2d');

  const { x, y } = transform.position;

  switch (collider.shape.type) {
    case 'box': {
      const { width, height } = collider.shape;
      return {
        min: {
          x: x - width / 2,
          y: y - height / 2,
        },
        max: {
          x: x + width / 2,
          y: y + height / 2,
        },
      };
    }
    case 'circle': {
      const { radius } = collider.shape;
      return {
        min: {
          x: x - radius,
          y: y - radius,
        },
        max: {
          x: x + radius,
          y: y + radius,
        },
      };
    }
  }
}
