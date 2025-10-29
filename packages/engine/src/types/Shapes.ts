/**
 * A circular shape.
 */
export type CircleShape = {
  /** The type of the shape. */
  type: 'circle';
  /** The radius of the circle. */
  radius: number;
};

/**
 * A box shape.
 */
export type BoxShape = {
  /** The type of the shape. */
  type: 'box';
  /** The width of the box. */
  width: number;
  /** The height of the box. */
  height: number;
};

/**
 * A geometric shape.
 */
export type Shape = CircleShape | BoxShape;
