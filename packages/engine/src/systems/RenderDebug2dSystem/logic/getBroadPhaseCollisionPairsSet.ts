import type { BroadPhaseCollisionPair } from '#/types';

export default function getBroadPhaseCollisionPairsSet(broadPhaseCollisionPairs: BroadPhaseCollisionPair[]) {
  const broadPhaseCollisionPairsSet = new Set<string>();
  for (const [entityA, entityB] of broadPhaseCollisionPairs) {
    broadPhaseCollisionPairsSet.add(entityA.id);
    broadPhaseCollisionPairsSet.add(entityB.id);
  }
  return broadPhaseCollisionPairsSet;
}
