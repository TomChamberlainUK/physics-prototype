import type { NarrowPhaseCollisionPair } from '#/types';

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
