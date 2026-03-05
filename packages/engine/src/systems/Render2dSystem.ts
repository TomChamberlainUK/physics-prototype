import type { Geometry2dComponent, Transform2dComponent } from '#src/components/index.js';
import type Entity from '#src/Entity.js';
import type { Context } from '#src/types/index.js';
import { lerp } from '#src/utils/index.js';
import System from './System.js';

/**
 * A system that renders 2D entities based on their transform and geometry components.
 */
export default class Render2dSystem extends System {
  name = 'Render2dSystem';
  type = 'render';

  /**
   * Renders 2D entities based on their transform and geometry components.
   * @param entities - The entities to render.
   * @param context - The context containing rendering information.
   */
  update(entities: Entity[], { alpha = 1, renderer }: Context): void {
    if (!renderer) return;

    for (const entity of entities) {
      if (!entity.hasComponents(['Transform2d', 'Geometry2d'])) {
        continue;
      }

      const transform = entity.getComponent<Transform2dComponent>('Transform2d');
      const geometry = entity.getComponent<Geometry2dComponent>('Geometry2d');

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
      const rotation = lerp(
        transform.previousRotation,
        transform.rotation,
        alpha,
      );

      renderer.save();
      renderer.translate({ x, y });
      renderer.rotate(rotation);

      switch (geometry.shape.type) {
        case 'circle':
          renderer.drawCircle({
            radius: geometry.shape.radius,
            fillColor: geometry.fillColor,
            strokeColor: geometry.strokeColor,
          });
          break;
        case 'box':
          renderer.drawBox({
            width: geometry.shape.width,
            height: geometry.shape.height,
            fillColor: geometry.fillColor,
            strokeColor: geometry.strokeColor,
          });
          break;
      }

      renderer.restore();
    }
  }
}
