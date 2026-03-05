import type { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { Matrix2d, Vector2d } from '#src/maths/index.js';

/**
 * The properties required to compute world vertices.
 */
type Properties = {
  /** The Collider2d component of the entity. */
  collider: Collider2dComponent;
  /** The Transform2d component of the entity. */
  transform: Transform2dComponent;
};

/**
 * The output of the computeWorldVertices function.
 */
type Output = Vector2d[] | null;

/**
 * Computes the world vertices of a 2D collider attached to a given entity.
 * @param properties - An object containing the Collider2d and Transform2d components, see {@link Properties}.
 * @returns An array of world vertices, or null if no vertices are available, see {@link Output}.
 */
export default function computeWorldVertices({ collider, transform }: Properties): Output {
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
