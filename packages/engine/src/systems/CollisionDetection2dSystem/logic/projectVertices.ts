import { Vector2d } from '#src/maths/index.js';

/**
 * Properties for projecting vertices onto an axis.
 */
type Properties = {
  /** The vertices to project. */
  vertices: Vector2d[];
  /** The axis to project onto. */
  axis: Vector2d;
};

/**
 * The output of the projectVertices function.
 */
type Output = {
  /** The minimum projection value on the axis. */
  min: number;
  /** The maximum projection value on the axis. */
  max: number;
};

/**
 * Projects the given vertices onto the specified axis and returns the minimum and maximum scalar values.
 * @param properties - An object containing the vertices and the axis to project onto, see {@link Properties}.
 * @returns An object containing the minimum and maximum projection scalars, see {@link Output}.
 */
export default function projectVertices({ vertices, axis }: Properties): Output {
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
