import type { BroadPhaseCollisionPair } from '#/types';

/**
 * Converts an array of broad-phase collision pairs into a set of unique entity IDs involved in potential collisions.
 * @param broadPhaseCollisionPairs - The array of broad-phase collision pairs.
 * @returns A set of unique entity IDs.
 */
export default function getBroadPhaseCollisionPairsSet(broadPhaseCollisionPairs: BroadPhaseCollisionPair[]) {
  const broadPhaseCollisionPairsSet = new Set<string>();
  for (const [entityA, entityB] of broadPhaseCollisionPairs) {
    broadPhaseCollisionPairsSet.add(entityA.id);
    broadPhaseCollisionPairsSet.add(entityB.id);
  }
  return broadPhaseCollisionPairsSet;
}
