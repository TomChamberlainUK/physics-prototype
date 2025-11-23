import { Vector2d } from '#/maths';

/**
 * Parameters for getClosestPointOnEdgeOfBox function.
 */
type Parameters = {
  /** The vertices of the box. */
  boxVertices: Vector2d[];
  /** The point to find the closest point on the box edge to. */
  point: Vector2d;
};

/**
 * Finds the closest point on the edge of a box to a given point.
 * @param boxVertices - The vertices of the box.
 * @param point - The point to find the closest point on the box edge to.
 * @returns The closest point on the edge of the box to the given point.
 */
export default function getClosestPointOnEdgeOfBox({ boxVertices, point }: Parameters) {
  let closestPoint: Vector2d | null = null;
  let minDistanceSquared = Infinity;

  // Iterate over each edge of the box
  for (let i = 0; i < boxVertices.length; i++) {
    const edgeStart = boxVertices[i];
    const edgeEnd = boxVertices[(i + 1) % boxVertices.length]; // Wrap around to the first vertex for the last edge

    if (!edgeStart || !edgeEnd) {
      throw new Error('Invalid box vertices');
    }

    // Get vectors for the edge and from edge start to the point
    const edgeSegment = edgeEnd.subtract(edgeStart);
    const toPoint = point.subtract(edgeStart);

    const edgeLengthSquared = edgeSegment.getLengthSquared();
    const projectionLength = Vector2d.dotProduct(toPoint, edgeSegment);

    // Calculate how far along the edge the projection falls (as a fraction of the edge length)
    const fractionAlongEdge = projectionLength / edgeLengthSquared;
    const clampedFractionAlongEdge = Math.max(0, Math.min(1, fractionAlongEdge));

    // Calculate the closest point on the edge to the given point
    const closestPointOnEdge = edgeStart.add(edgeSegment.multiply(clampedFractionAlongEdge));
    const distanceSquared = closestPointOnEdge.subtract(point).getLengthSquared();

    // Update closest point if this one is closer
    if (distanceSquared < minDistanceSquared) {
      closestPoint = closestPointOnEdge;
      minDistanceSquared = distanceSquared;
    }
  }

  if (!closestPoint) {
    throw new Error('No vertices provided');
  }

  return closestPoint;
}
