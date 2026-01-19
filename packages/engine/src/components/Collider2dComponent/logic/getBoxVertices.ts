import { Vector2d } from '#/maths';

/**
 * Parameters for calculating box vertices.
 */
type Parameters = {
  /** The width of the box. */
  width: number;
  /** The height of the box. */
  height: number;
};

/**
 * Calculates and returns the vertices of a box centered at the origin.
 * @param parameters - The width and height of the box, see {@link Parameters}.
 * @returns An array of vertices representing the corners of the box.
 */
export default function getBoxVertices({ width, height }: Parameters) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return [
    new Vector2d({ x: -halfWidth, y: -halfHeight }),
    new Vector2d({ x: halfWidth, y: -halfHeight }),
    new Vector2d({ x: halfWidth, y: halfHeight }),
    new Vector2d({ x: -halfWidth, y: halfHeight }),
  ];
}
