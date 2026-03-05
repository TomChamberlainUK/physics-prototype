import type { Vector2d } from '#src/maths/index.js';
import type { AABB } from '#src/types/index.js';

/**
 * Properties required to compute the AABB for a circle.
 */
type Properties = {
  /** The radius of the circle. */
  radius: number;
  /** The position of the circle's center. */
  position: Vector2d;
};

/**
 * Computes and returns the axis-aligned bounding box (AABB) for a circle.
 * @param properties - The radius and position of the circle, see {@link Properties}.
 * @returns The computed AABB, see {@link AABB}.
 */
export default function computeCircleAABB({ radius, position }: Properties): AABB {
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
