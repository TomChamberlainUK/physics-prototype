import type Entity from '#/Entity';
import System from './System';
import type { Context, Geometry2dComponent, Transform2dComponent } from '..';

export default class Render2dSystem extends System {
  type = 'render';

  constructor() {
    super();
  }

  update(entities: Entity[], { alpha = 1, renderer }: Context): void {
    if (!renderer) return;

    for (const entity of entities) {
      if (!entity.hasComponents(['Transform2d', 'Geometry2d'])) {
        continue;
      }

      const transform = entity.getComponent<Transform2dComponent>('Transform2d');
      const geometry = entity.getComponent<Geometry2dComponent>('Geometry2d');

      const x = transform.previousPosition.x + (transform.position.x - transform.previousPosition.x) * alpha;
      const y = transform.previousPosition.y + (transform.position.y - transform.previousPosition.y) * alpha;

      switch (geometry.shape.type) {
        case 'circle':
          renderer.drawCircle({
            x,
            y,
            radius: geometry.shape.radius,
            color: geometry.color,
          });
          break;
        case 'box':
          renderer.drawBox({
            x,
            y,
            width: geometry.shape.width,
            height: geometry.shape.height,
            color: geometry.color,
          });
          break;
      }
    }
  }
}
