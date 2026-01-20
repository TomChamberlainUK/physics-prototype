import type { Vector2d } from '#/maths';
import type { AABB } from '#/types';

/**
 * Parameters required to compute the AABB for a circle.
 */
type Parameters = {
  /** The radius of the circle. */
  radius: number;
  /** The position of the circle's center. */
  position: Vector2d;
};

/**
 * Computes and returns the axis-aligned bounding box (AABB) for a circle.
 * @param parameters - The parameters required to compute the AABB, see {@link Parameters}.
 * @returns The computed AABB, see {@link AABB}.
 */
export default function computeCircleAABB({ radius, position }: Parameters): AABB {
  return {
    min: {
      x: position.x - radius,
      y: position.y - radius,
    },
    max: {
      x: position.x + radius,
      y: position.y + radius,
    },
  };
}
