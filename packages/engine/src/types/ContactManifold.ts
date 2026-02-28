import type { Vector2d } from '#src/maths/index.js';

/**
 * Represents the contact manifold resulting from a collision between two entities.
 */
export type ContactManifold = {
  /** The normal vector at the point of contact. */
  normal: Vector2d;
  /** The amount of overlap between the two entities. */
  overlap: number;
  /** The contact points of the collision. */
  contactPoints: Vector2d[];
};
