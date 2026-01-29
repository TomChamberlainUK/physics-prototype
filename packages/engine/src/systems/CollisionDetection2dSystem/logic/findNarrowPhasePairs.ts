import type Entity from '#/Entity';
import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type { NarrowPhaseCollisionPair } from '#/types';
import detectCollision from './detectCollision';

/**
 * Identifies actual collision pairs from candidate pairs using narrow-phase collision detection.
 * @param candidatePairs - The candidate entity pairs to check for collisions, see {@link Entity}.
 * @returns An array of narrow-phase collision pairs with detailed collision information, see {@link NarrowPhaseCollisionPair}.
 */
export default function findNarrowPhasePairs(candidatePairs: [Entity, Entity][]): NarrowPhaseCollisionPair[] {
  const collisionPairs: NarrowPhaseCollisionPair[] = [];

  for (const [entityA, entityB] of candidatePairs) {
    const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
    const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
    const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
    const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

    const collision = detectCollision({
      colliderA,
      colliderB,
      transformA,
      transformB,
    });

    if (!collision.isColliding) {
      continue;
    }

    collisionPairs.push({
      entityA,
      entityB,
      contactManifold: collision.contactManifold,
    });
  }

  return collisionPairs;
}
