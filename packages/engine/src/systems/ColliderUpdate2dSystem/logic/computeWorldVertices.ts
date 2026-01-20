import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import { Matrix2d, Vector2d } from '#/maths';

/**
 * Computes the world vertices of a 2D collider attached to a given entity.
 * @param entity - The entity containing the Collider2d and Transform2d components.
 * @returns An array of world vertices or null if components are missing.
 */
export default function computeWorldVertices(entity: Entity) {
  if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
    return null;
  }

  const collider = entity.getComponent<Collider2dComponent>('Collider2d');
  const transform = entity.getComponent<Transform2dComponent>('Transform2d');

  if (!collider.localVertices) {
    return null;
  }

  const translationMatrix = Matrix2d.translation(transform.position);
  const rotationMatrix = Matrix2d.rotation(transform.rotation);
  const transformMatrix = Matrix2d.multiply(translationMatrix, rotationMatrix);

  const vertices = collider.localVertices.map(vertex => (
    new Vector2d(transformMatrix.transformPoint(vertex))
  ));

  return vertices;
}
