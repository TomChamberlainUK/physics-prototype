import { Vector2d } from '#/maths';

/**
 * Parameters for projecting a circle onto an axis.
 */
type Parameters = {
  /** The position of the center of the circle to project. */
  position: Vector2d;
  /** The radius of the circle to project. */
  radius: number;
  /** The axis to project onto. */
  axis: Vector2d;
};

/**
 * Projects a circle onto a given axis and returns the minimum and maximum scalar projections.
 * @param position - The position of the center of the circle to project.
 * @param radius - The radius of the circle to project.
 * @param axis - The axis to project onto.
 * @returns An object containing the min and max projections of the circle onto the axis.
 */
export default function projectCircle({ position, radius, axis }: Parameters) {
  const centerProjection = Vector2d.dotProduct(position, axis);
  return {
    min: centerProjection - radius,
    max: centerProjection + radius,
  };
}
