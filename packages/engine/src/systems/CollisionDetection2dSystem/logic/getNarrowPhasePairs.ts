import type Entity from '#/Entity';
import type { NarrowPhaseCollisionPair } from '#/types';
import getCollision from './getCollision';

/**
 * Identifies actual collision pairs from candidate pairs using narrow-phase collision detection.
 * @param candidatePairs - The candidate entity pairs to check for collisions.
 * @returns An array of narrow-phase collision pairs with detailed collision information.
 */
export default function getNarrowPhasePairs(candidatePairs: [Entity, Entity][]) {
  const collisionPairs: NarrowPhaseCollisionPair[] = [];
  for (const [entityA, entityB] of candidatePairs) {
    const collision = getCollision(entityA, entityB);
    if (!collision.isColliding) {
      continue;
    }
    collisionPairs.push({
      entityA,
      entityB,
      normal: collision.normal,
      overlap: collision.overlap,
    });
  }
  return collisionPairs;
}
