import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { CollisionDetection2dSystem } from '#/systems';
import * as findBroadPhasePairsModule from '#/systems/CollisionDetection2dSystem/logic/findBroadPhasePairs';
import * as findNarrowPhasePairsModule from '#/systems/CollisionDetection2dSystem/logic/findNarrowPhasePairs';
import type { BroadPhaseCollisionPair, NarrowPhaseCollisionPair } from '#/types';

describe('CollisionDetection2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new CollisionDetection2dSystem();
      expect(system).toBeInstanceOf(CollisionDetection2dSystem);
      expect(system.name).toBe('CollisionDetection2dSystem');
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    let system: CollisionDetection2dSystem;
    let entityA: Entity;
    let entityB: Entity;

    let findBroadPhasePairsSpy: MockInstance<typeof findBroadPhasePairsModule.default>;
    let findNarrowPhasePairsSpy: MockInstance<typeof findNarrowPhasePairsModule.default>;

    beforeAll(() => {
      findBroadPhasePairsSpy = vi.spyOn(findBroadPhasePairsModule, 'default');
      findNarrowPhasePairsSpy = vi.spyOn(findNarrowPhasePairsModule, 'default');
    });

    beforeEach(() => {
      system = new CollisionDetection2dSystem();
      entityA = new Entity();
      entityB = new Entity();
    });

    afterEach(() => {
      findBroadPhasePairsSpy.mockClear();
      findNarrowPhasePairsSpy.mockClear();
    });

    afterAll(() => {
      findBroadPhasePairsSpy.mockRestore();
      findNarrowPhasePairsSpy.mockRestore();
    });

    describe('When passed entities with valid components', () => {
      beforeEach(() => {
        for (const entity of [entityA, entityB]) {
          entity.addComponents([
            new Collider2dComponent({
              shape: {
                type: 'box',
                width: 32,
                height: 32,
              },
            }),
            new Transform2dComponent(),
          ]);
        }
      });

      it('Should get candidate pairs via broad phase detection', () => {
        system.update([entityA, entityB], {});
        expect(findBroadPhasePairsSpy).toHaveBeenCalledWith([entityA, entityB]);
      });

      it('Should get collision pairs from candidate pairs via broad phase detection', () => {
        findBroadPhasePairsSpy.mockReturnValueOnce([[entityA, entityB]]);
        system.update([entityA, entityB], {});
        expect(findNarrowPhasePairsSpy).toHaveBeenCalledWith([[entityA, entityB]]);
      });

      it('Should update context broadPhaseCollisionPairs', () => {
        const broadPhasePairs: BroadPhaseCollisionPair[] = [[entityA, entityB]];
        findBroadPhasePairsSpy.mockReturnValueOnce(broadPhasePairs);
        const context = {
          broadPhaseCollisionPairs: [],
        };
        system.update([entityA, entityB], context);
        expect(context.broadPhaseCollisionPairs).toEqual(broadPhasePairs);
      });

      it('Should update context narrowPhaseCollisionPairs', () => {
        const narrowPhaseCollisionPairs: NarrowPhaseCollisionPair[] = [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: 1 }),
            overlap: 1,
            contactPoints: [],
          },
        }];
        const context = {
          narrowPhaseCollisionPairs: [],
        };
        findNarrowPhasePairsSpy.mockReturnValueOnce(narrowPhaseCollisionPairs);
        system.update([entityA, entityB], context);
        expect(context.narrowPhaseCollisionPairs).toEqual(narrowPhaseCollisionPairs);
      });
    });

    describe('When passed entities without valid components', () => {
      it('Should not get candidate pairs via broad phase detection', () => {
        system.update([entityA, entityB], {});
        expect(findBroadPhasePairsSpy).toHaveBeenCalledWith([]);
      });

      it('Should not get collision pairs from candidate pairs via narrow phase detection', () => {
        system.update([entityA, entityB], {});
        expect(findNarrowPhasePairsSpy).toHaveBeenCalledWith([]);
      });

      it('Should not update context broadPhaseCollisionPairs', () => {
        const context = {
          broadPhaseCollisionPairs: [],
        };
        system.update([entityA, entityB], context);
        expect(context.broadPhaseCollisionPairs).toEqual([]);
      });

      it('Should not update context narrowPhaseCollisionPairs', () => {
        const context = {
          narrowPhaseCollisionPairs: [],
        };
        system.update([entityA, entityB], context);
        expect(context.narrowPhaseCollisionPairs).toEqual([]);
      });
    });
  });
});
