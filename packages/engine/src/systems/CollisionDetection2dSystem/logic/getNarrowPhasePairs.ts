import type Entity from '#/Entity';
import type { CollisionPair } from '#/index';
import getCollision from './getCollision';

export default function getNarrowPhasePairs(candidatePairs: [Entity, Entity][]) {
  const collisionPairs: CollisionPair[] = [];
  for (const [entityA, entityB] of candidatePairs) {
    const { isColliding, normal, overlap } = getCollision(entityA, entityB);
    if (!isColliding) {
      continue;
    }
    collisionPairs.push({
      entityA,
      entityB,
      normal: normal!,
      overlap: overlap!,
    });
  }
  return collisionPairs;
}
