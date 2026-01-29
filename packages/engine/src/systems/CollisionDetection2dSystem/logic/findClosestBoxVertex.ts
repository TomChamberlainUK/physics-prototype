import type { Vector2d } from '#/maths';

/**
 * Properties for findClosestBoxVertex function.
 */
type Properties = {
  /** The vertices of the box. */
  vertices: Vector2d[];
  /** The point to find the closest vertex to. */
  point: Vector2d;
};

/**
 * Finds the vertex of a box that is closest to a given point.
 * @param properties - An object containing the box vertices and the point to check against, see {@link Properties}.
 * @returns The closest vertex to the given point, see {@link Vector2d}.
 */
export default function findClosestBoxVertex({ vertices, point }: Properties): Vector2d {
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
