import type { Vector2d } from '#src/maths/index.js';

/**
 * Parameters for the isPointInConvexPolygon function.
 */
type Parameters = {
  /** The point to test. */
  point: Vector2d;
  /** The vertices of the convex polygon in order. */
  polygonVertices: Vector2d[];
};

/**
 * Determines if a point is inside or extremely close to (within a small epsilon) a convex polygon using the cross product method.
 * @param point - The point to test.
 * @param polygonVertices - The vertices of the convex polygon in order.
 * @returns True if the point is inside the polygon, false otherwise.
 */
export default function isPointNearConvexPolygon({ point, polygonVertices }: Parameters) {
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

    // If the cross product is close to zero, the point is on the edge; continue to next edge
    if (Math.abs(cross) < 1e-10) {
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
