import type { NarrowPhaseCollisionPair } from '#/types';

/**
 * Converts an array of narrow-phase collision pairs into a map where each key is an entity ID
 * and the value is a set of entity IDs that it is colliding with.
 * @param narrowPhaseCollisionPairs - The array of narrow-phase collision pairs.
 * @returns A map of entity IDs to sets of colliding entity IDs.
 */
export default function getNarrowPhaseCollisionPairsMap(narrowPhaseCollisionPairs: NarrowPhaseCollisionPair[]) {
  const map = new Map<string, Set<string>>();
  for (const { entityA, entityB } of narrowPhaseCollisionPairs) {
    if (!map.has(entityA.id)) {
      map.set(entityA.id, new Set());
    }
    map.get(entityA.id)!.add(entityB.id);
  }
  return map;
}
