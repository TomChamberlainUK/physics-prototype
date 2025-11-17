import type Entity from '#/Entity';
import { Matrix2d, type Collider2dComponent, type Transform2dComponent } from '#/index';
import getBoxVertices from './getBoxVertices';

export default function getVertices(entity: Entity) {
  if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
    return null;
  }

  const collider = entity.getComponent<Collider2dComponent>('Collider2d');
  const transform = entity.getComponent<Transform2dComponent>('Transform2d');

  let vertices: { x: number; y: number }[] | null = null;

  switch (collider.shape.type) {
    case 'box': {
      vertices = getBoxVertices({
        width: collider.shape.width,
        height: collider.shape.height,
      });
      break;
    }
  }

  if (vertices) {
    const translationMatrix = Matrix2d.translation(transform.position);
    const rotationMatrix = Matrix2d.rotation(transform.rotation);
    const transformMatrix = Matrix2d.multiply(translationMatrix, rotationMatrix);

    vertices = vertices.map(vertex => transformMatrix.transformPoint(vertex));
  }

  return vertices;
}
