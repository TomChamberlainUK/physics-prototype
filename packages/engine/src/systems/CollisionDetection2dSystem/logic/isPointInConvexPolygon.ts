import type { Vector2d } from '#src/maths/index.js';

/**
 * Properties for the isPointInConvexPolygon function.
 */
type Properties = {
  /** The point to test. */
  point: Vector2d;
  /** The vertices of the convex polygon in order. */
  polygonVertices: Vector2d[];
};

/**
 * Determines if a point is inside a convex polygon using the cross product method.
 * @param properties - An object containing the point to test and the vertices of the convex polygon, see {@link Properties}.
 * @returns True if the point is inside the polygon, false otherwise.
 */
export default function isPointInConvexPolygon({ point, polygonVertices }: Properties) {
  let sign: number | null = null; // Represents what side of the edge the point is on, +1 or -1
  const vertexCount = polygonVertices.length;

  for (let i = 0; i < vertexCount; i++) {
    const vertexA = polygonVertices[i];
    const vertexB = polygonVertices[(i + 1) % vertexCount]; // Wrap around to the first vertex if needed

    if (!vertexA || !vertexB) {
      return false;
    }

    const edge = vertexB.subtract(vertexA);
    const toPoint = point.subtract(vertexA);

    // The cross will be either positive on one side of the edge, negative on the other
    const cross = edge.x * toPoint.y - edge.y * toPoint.x;

    // If the cross product is zero, the point is on the edge; continue to next edge
    if (cross === 0) {
      continue;
    }

    // If this is the first non-zero cross, set the sign
    if (sign === null) {
      sign = Math.sign(cross);
    }

    // If the sign differs, the point is outside the polygon
    else if (Math.sign(cross) !== sign) {
      return false;
    }
  }

  // If all signs match, the point is inside or on the edge of the polygon
  return true;
}
