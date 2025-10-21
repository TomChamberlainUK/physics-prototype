import type Entity from '#/Entity';
import System from './System';
import type { Context, Geometry2dComponent, Transform2dComponent } from '..';
import { lerp } from '#/utils';

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

      const x = lerp(transform.previousPosition.x, transform.position.x, alpha);
      const y = lerp(transform.previousPosition.y, transform.position.y, alpha);

      switch (geometry.shape.type) {
        case 'circle':
          renderer.drawCircle({
            x,
            y,
            radius: geometry.shape.radius,
            fillColor: geometry.fillColor,
            strokeColor: geometry.strokeColor,
          });
          break;
        case 'box':
          renderer.drawBox({
            x,
            y,
            width: geometry.shape.width,
            height: geometry.shape.height,
            fillColor: geometry.fillColor,
            strokeColor: geometry.strokeColor,
          });
          break;
      }
    }
  }
}
