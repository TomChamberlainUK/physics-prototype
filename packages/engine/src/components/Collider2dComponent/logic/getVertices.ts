import type { Shape } from '#src/types/index.js';
import getBoxVertices from './getBoxVertices.js';

/**
 * Returns the vertices of a given shape.
 * @param shape - The shape for which to get the vertices, see {@link Shape}.
 * @returns An array of vertices or null if the shape has no vertices.
 */
export default function getVertices(shape: Shape) {
  switch (shape.type) {
    case 'box': {
      return getBoxVertices({
        width: shape.width,
        height: shape.height,
      });
    }
    default: {
      return null;
    }
  }
}
