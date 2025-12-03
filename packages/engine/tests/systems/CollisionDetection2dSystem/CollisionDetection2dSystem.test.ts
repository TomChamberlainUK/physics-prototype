import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { CollisionDetection2dSystem } from '#/systems';
import * as getBroadPhasePhasePairsModule from '#/systems/CollisionDetection2dSystem/logic/getBroadPhasePairs';
import * as getNarrowPhasePairsModule from '#/systems/CollisionDetection2dSystem/logic/getNarrowPhasePairs';
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

    let getBroadPhasePairsSpy: MockInstance<typeof getBroadPhasePhasePairsModule.default>;
    let getNarrowPhasePairsSpy: MockInstance<typeof getNarrowPhasePairsModule.default>;

    beforeAll(() => {
      getBroadPhasePairsSpy = vi.spyOn(getBroadPhasePhasePairsModule, 'default');
      getNarrowPhasePairsSpy = vi.spyOn(getNarrowPhasePairsModule, 'default');
    });

    beforeEach(() => {
      system = new CollisionDetection2dSystem();
      entityA = new Entity();
      entityB = new Entity();
    });

    afterEach(() => {
      getBroadPhasePairsSpy.mockClear();
      getNarrowPhasePairsSpy.mockClear();
    });

    afterAll(() => {
      getBroadPhasePairsSpy.mockRestore();
      getNarrowPhasePairsSpy.mockRestore();
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
        expect(getBroadPhasePairsSpy).toHaveBeenCalledWith([entityA, entityB]);
      });

      it('Should get collision pairs from candidate pairs via broad phase detection', () => {
        getBroadPhasePairsSpy.mockReturnValueOnce([[entityA, entityB]]);
        system.update([entityA, entityB], {});
        expect(getNarrowPhasePairsSpy).toHaveBeenCalledWith([[entityA, entityB]]);
      });

      it('Should update context broadPhaseCollisionPairs', () => {
        const broadPhasePairs: BroadPhaseCollisionPair[] = [[entityA, entityB]];
        getBroadPhasePairsSpy.mockReturnValueOnce(broadPhasePairs);
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
        getNarrowPhasePairsSpy.mockReturnValueOnce(narrowPhaseCollisionPairs);
        system.update([entityA, entityB], context);
        expect(context.narrowPhaseCollisionPairs).toEqual(narrowPhaseCollisionPairs);
      });
    });

    describe('When passed entities without valid components', () => {
      it('Should not get candidate pairs via broad phase detection', () => {
        system.update([entityA, entityB], {});
        expect(getBroadPhasePairsSpy).toHaveBeenCalledWith([]);
      });

      it('Should not get collision pairs from candidate pairs via narrow phase detection', () => {
        system.update([entityA, entityB], {});
        expect(getNarrowPhasePairsSpy).toHaveBeenCalledWith([]);
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
