import type Entity from '#/Entity';
import type Vector2d from '#/maths/Vector2d';

export type NarrowPhaseCollisionPair = {
  entityA: Entity;
  entityB: Entity;
  normal: Vector2d;
  overlap: number;
};
