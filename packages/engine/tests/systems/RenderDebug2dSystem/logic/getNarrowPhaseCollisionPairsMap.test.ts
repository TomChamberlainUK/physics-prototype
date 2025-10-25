import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { getNarrowPhaseCollisionPairsMap } from '#/systems/RenderDebug2dSystem/logic';
import type { NarrowPhaseCollisionPair } from '#/types';
import { describe, expect, it } from 'vitest';

describe('getNarrowPhaseCollisionPairsMap', () => {
  it('Should return a map of entity ID pairs from narrowPhaseCollisionPairs', () => {
    const entityA = new Entity();
    const entityB = new Entity();
    const entityC = new Entity();
    const narrowPhaseCollisionPairs: NarrowPhaseCollisionPair[] = [
      {
        entityA,
        entityB,
        normal: new Vector2d(),
        overlap: 0,
      },
      {
        entityA: entityB,
        entityB: entityC,
        normal: new Vector2d(),
        overlap: 0,
      },
      {
        entityA,
        entityB: entityC,
        normal: new Vector2d(),
        overlap: 0,
      },
    ];
    const result = getNarrowPhaseCollisionPairsMap(narrowPhaseCollisionPairs);
    console.log(result);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(2);
    expect(result.get(entityA.id)?.has(entityB.id)).toBe(true);
    expect(result.get(entityA.id)?.has(entityC.id)).toBe(true);
    expect(result.get(entityB.id)?.has(entityC.id)).toBe(true);
  });
});
