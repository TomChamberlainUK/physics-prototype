import type { Vector2d } from '#/maths';

/**
 * Computes the two unique axes (normals) of a box given its four vertices.
 * @param vertices - An array of four Vector2d objects representing the box vertices in order.
 * @returns An array containing the two unique axes as Vector2d objects.
 */
export default function computeBoxAxes(vertices: Vector2d[]): Vector2d[] {
  const vertexA = vertices[0];
  const vertexB = vertices[1];
  const vertexC = vertices[2];

  if (vertices.length !== 4) {
    throw new Error('computeBoxAxes requires exactly 4 vertices.');
  }

  if (!vertexA || !vertexB || !vertexC) {
    throw new Error('Vertices must be defined Vector2d objects.');
  }

  const edgeAB = vertexB.subtract(vertexA);
  const edgeBC = vertexC.subtract(vertexB);

  const axisA = edgeAB.getNormal().getUnit();
  const axisB = edgeBC.getNormal().getUnit();

  return [axisA, axisB];
}
