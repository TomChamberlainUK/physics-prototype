/**
 * Parameters required to compute the AABB for a circle.
 */
type Parameters = {
  /** The radius of the circle. */
  radius: number;
  /** The position of the circle's center. */
  position: {
    x: number;
    y: number;
  };
};

/**
 * Computes and returns the axis-aligned bounding box (AABB) for a circle.
 * @param radius - The radius of the circle.
 * @param position - The position of the circle's center.
 * @returns The computed AABB.
 */
export default function computeCircleAABB({ radius, position }: Parameters) {
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
