import { Vector2d } from '#src/maths/index.js';

/**
 * Properties for projecting a circle onto an axis.
 */
type Properties = {
  /** The position of the center of the circle to project. */
  position: Vector2d;
  /** The radius of the circle to project. */
  radius: number;
  /** The axis to project onto. */
  axis: Vector2d;
};

/**
 * The output of the projectCircle function.
 */
type Output = {
  /** The minimum projection value on the axis. */
  min: number;
  /** The maximum projection value on the axis. */
  max: number;
};

/**
 * Projects a circle onto a given axis and returns the minimum and maximum scalar projections.
 * @param properties - An object containing the position, radius, and axis to project onto, see {@link Properties}.
 * @returns An object containing the min and max projections of the circle onto the axis, see {@link Output}.
 */
export default function projectCircle({ position, radius, axis }: Properties): Output {
  const centerProjection = Vector2d.dotProduct(position, axis);
  return {
    min: centerProjection - radius,
    max: centerProjection + radius,
  };
}
