import type Entity from '#src/Entity.js';
import type { ContactManifold } from './ContactManifold.js';

/**
 * A pair of entities that are confirmed to be colliding, along with collision details.
 */
export type NarrowPhaseCollisionPair = {
  /** The first entity in the collision pair. */
  entityA: Entity;
  /** The second entity in the collision pair. */
  entityB: Entity;
  /** The collision manifold containing detailed collision information. */
  contactManifold: ContactManifold;
};
