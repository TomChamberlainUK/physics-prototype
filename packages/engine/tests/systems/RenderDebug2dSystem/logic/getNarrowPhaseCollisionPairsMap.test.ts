import { describe, expect, it } from 'vitest';
import Entity from '#src/Entity.js';
import { Vector2d } from '#src/maths/index.js';
import { getNarrowPhaseCollisionPairsMap } from '#src/systems/RenderDebug2dSystem/logic/index.js';
import type { NarrowPhaseCollisionPair } from '#src/types/index.js';

describe('getNarrowPhaseCollisionPairsMap', () => {
  it('Should return a map of entity ID pairs from narrowPhaseCollisionPairs', () => {
    const entityA = new Entity();
    const entityB = new Entity();
    const entityC = new Entity();
    const narrowPhaseCollisionPairs: NarrowPhaseCollisionPair[] = [
      {
        entityA,
        entityB,
        contactManifold: {
          normal: new Vector2d(),
          overlap: 0,
          contactPoints: [],
        },
      },
      {
        entityA: entityB,
        entityB: entityC,
        contactManifold: {
          normal: new Vector2d(),
          overlap: 0,
          contactPoints: [],
        },
      },
      {
        entityA,
        entityB: entityC,
        contactManifold: {
          normal: new Vector2d(),
          overlap: 0,
          contactPoints: [],
        },
      },
    ];
    const result = getNarrowPhaseCollisionPairsMap(narrowPhaseCollisionPairs);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(2);
    expect(result.get(entityA.id)?.has(entityB.id)).toBe(true);
    expect(result.get(entityA.id)?.has(entityC.id)).toBe(true);
    expect(result.get(entityB.id)?.has(entityC.id)).toBe(true);
  });
});
