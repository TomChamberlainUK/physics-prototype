/**
 * Axis-Aligned Bounding Box (AABB) type definition.
 */
export type AABB = {
  /** The minimum corner of the AABB. */
  min: {
    /** The x-coordinate of the minimum corner. */
    x: number;
    /** The y-coordinate of the minimum corner. */
    y: number;
  };
  /** The maximum corner of the AABB. */
  max: {
    /** The x-coordinate of the maximum corner. */
    x: number;
    /** The y-coordinate of the maximum corner. */
    y: number;
  };
};
