import type { Vector2d } from '#/maths';

export type Collision = {
  /** Indicates whether a collision has occurred. */
  isColliding: false;
} | {
  /** Indicates whether a collision has occurred. */
  isColliding: true;
  /** The normal vector at the point of collision. */
  normal: Vector2d;
  /** The amount of overlap between the two entities. */
  overlap: number;
  /** The contact point of the collision. */
  contactPoint?: Vector2d;
};
