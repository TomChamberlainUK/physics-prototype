import type Entity from '#/Entity';
import type { NarrowPhaseCollisionPair } from '#/types';
import getCollision from './getCollision';

export default function getNarrowPhasePairs(candidatePairs: [Entity, Entity][]) {
  const collisionPairs: NarrowPhaseCollisionPair[] = [];
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
