import type Entity from '#/Entity';
import type Vector2d from '#/maths/Vector2d';

/**
 * A pair of entities that are confirmed to be colliding, along with collision details.
 */
export type NarrowPhaseCollisionPair = {
  /** The first entity in the collision pair. */
  entityA: Entity;
  /** The second entity in the collision pair. */
  entityB: Entity;
  /** The normal vector at the point of collision. */
  normal: Vector2d;
  /** The amount of overlap between the two entities. */
  overlap: number;
  /** The contact points of the collision. */
  contactPoints: Vector2d[];
};
