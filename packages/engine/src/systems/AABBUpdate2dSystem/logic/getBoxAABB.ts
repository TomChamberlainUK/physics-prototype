/**
 * Parameters required to calculate the AABB for a box.
 */
type Parameters = {
  /** The width of the box. */
  width: number;
  /** The height of the box. */
  height: number;
  /** The position of the box's center. */
  position: {
    x: number;
    y: number;
  };
};

/**
 * Calculates and returns the axis-aligned bounding box (AABB) for a box.
 * @param width - The width of the box.
 * @param height - The height of the box.
 * @param position - The position of the box's center.
 * @returns The calculated AABB.
 */
export default function getBoxAABB({ width, height, position }: Parameters) {
  return {
    min: {
      x: position.x - width / 2,
      y: position.y - height / 2,
    },
    max: {
      x: position.x + width / 2,
      y: position.y + height / 2,
    },
  };
}
