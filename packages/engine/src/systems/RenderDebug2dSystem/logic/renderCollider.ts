import { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import type Renderer from '#/Renderer';
import { lerp } from '#/utils';

/**
 * Parameters for rendering the collider.
 */
type Params = {
  /** The interpolation alpha value for rendering. */
  alpha?: number;
  /** The renderer used to draw the collider. */
  renderer: Renderer;
};

/**
 * Renders the collider of the given entity for debugging purposes.
 * @param entity - The entity whose collider to render.
 * @param params - The parameters for rendering, including alpha and renderer.
 */
export default function renderCollider(entity: Entity, {
  alpha = 1,
  renderer,
}: Params) {
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

  const color = 'rgb(0, 255, 0)';

  switch (collider.shape.type) {
    case 'box': {
      if (!collider.worldVertices) {
        return;
      }
      renderer.drawShape({
        vertices: collider.worldVertices,
        strokeColor: color,
      });
      for (const vertex of collider.worldVertices) {
        renderer.drawCircle({
          x: vertex.x,
          y: vertex.y,
          radius: 2,
          fillColor: color,
        });
      }
      break;
    }
    case 'circle': {
      const { radius } = collider.shape;
      renderer.drawCircle({
        x,
        y,
        radius,
        strokeColor: color,
      });
      break;
    }
  }
}
