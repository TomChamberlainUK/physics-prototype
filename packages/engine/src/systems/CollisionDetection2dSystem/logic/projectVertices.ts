import { Vector2d } from '#/maths';

type Parameters = {
  /** The vertices to project. */
  vertices: Vector2d[];
  /** The axis to project onto. */
  axis: Vector2d;
};

/**
 * Projects the given vertices onto the specified axis and returns the minimum and maximum scalar values.
 * @param vertices - An array of Vector2d objects representing the vertices to project.
 * @param axis - The axis (as a Vector2d) onto which to project the vertices.
 * @returns An object containing the minimum and maximum projection scalars.
 */
export default function projectVertices({ vertices, axis }: Parameters) {
  let min: number = Infinity;
  let max: number = -Infinity;

  for (const vertex of vertices) {
    const projection = Vector2d.dotProduct(vertex, axis);
    if (projection < min) {
      min = projection;
    }
    if (projection > max) {
      max = projection;
    }
  }

  if (min === Infinity || max === -Infinity) {
    throw new Error('No vertices to project');
  }

  return { min, max };
}
