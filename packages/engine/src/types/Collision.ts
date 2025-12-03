import type { ContactManifold } from './ContactManifold';

/**
 * Represents the result of a collision detection between two entities.
 */
export type Collision = {
  /** Indicates whether a collision has occurred. */
  isColliding: false;
} | {
  /** Indicates whether a collision has occurred. */
  isColliding: true;
  /** The contact manifold of the collision. */
  contactManifold: ContactManifold;
};
