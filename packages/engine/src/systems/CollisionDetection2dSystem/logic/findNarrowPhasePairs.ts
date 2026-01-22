import type Entity from '#/Entity';
import type { NarrowPhaseCollisionPair } from '#/types';
import detectCollision from './detectCollision';

/**
 * Identifies actual collision pairs from candidate pairs using narrow-phase collision detection.
 * @param candidatePairs - The candidate entity pairs to check for collisions.
 * @returns An array of narrow-phase collision pairs with detailed collision information.
 */
export default function findNarrowPhasePairs(candidatePairs: [Entity, Entity][]): NarrowPhaseCollisionPair[] {
  const collisionPairs: NarrowPhaseCollisionPair[] = [];
  for (const [entityA, entityB] of candidatePairs) {
    const collision = detectCollision(entityA, entityB);
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
