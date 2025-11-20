import type { Vector2d } from '#/maths';

/**
 * Parameters for getClosestBoxVertex function.
 */
type Parameters = {
  /** The vertices of the box. */
  vertices: Vector2d[];
  /** The point to find the closest vertex to. */
  point: Vector2d;
};

/**
 * Finds the vertex of a box that is closest to a given point.
 * @param vertices - The vertices of the box.
 * @param point - The point to find the closest vertex to.
 * @returns The closest vertex to the given point.
 */
export default function getClosestBoxVertex({ vertices, point }: Parameters): Vector2d {
  let closest: Vector2d | null = null;
  let minDistanceSquared = Infinity;

  for (const vertex of vertices) {
    const distanceSquared = vertex.subtract(point).getLengthSquared();
    if (distanceSquared < minDistanceSquared) {
      closest = vertex;
      minDistanceSquared = distanceSquared;
    }
  }

  if (!closest) {
    throw new Error('No vertices provided');
  }

  return closest;
}
