/**
 * Parameters required to calculate the AABB for a circle.
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
 * Calculates and returns the axis-aligned bounding box (AABB) for a circle.
 * @param radius - The radius of the circle.
 * @param position - The position of the circle's center.
 * @returns The calculated AABB.
 */
export default function getCircleAABB({ radius, position }: Parameters) {
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
