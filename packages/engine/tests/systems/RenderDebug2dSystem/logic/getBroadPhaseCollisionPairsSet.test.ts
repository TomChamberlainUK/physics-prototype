import Entity from '#/Entity';
import { getBroadPhaseCollisionPairsSet } from '#/systems/RenderDebug2dSystem/logic';
import type { BroadPhaseCollisionPair } from '#/types';
import { describe, expect, it } from 'vitest';

describe('getBroadPhaseCollisionPairsSet', () => {
  it('Should return a set of unique IDs from broadPhaseCollisionPairs', () => {
    const entityA = new Entity();
    const entityB = new Entity();
    const entityC = new Entity();
    const broadPhaseCollisionPairs: BroadPhaseCollisionPair[] = [
      [entityA, entityB],
      [entityB, entityC],
      [entityA, entityC],
    ];
    const output = getBroadPhaseCollisionPairsSet(broadPhaseCollisionPairs);
    expect(output).toBeInstanceOf(Set);
    expect(output.size).toBe(3);
    expect(output.has(entityA.id)).toBe(true);
    expect(output.has(entityB.id)).toBe(true);
    expect(output.has(entityC.id)).toBe(true);
  });
});
