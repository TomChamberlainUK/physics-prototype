import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import Entity from '#src/Entity.js';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import * as areAABBsOverlappingModule from '#src/systems/CollisionDetection2dSystem/logic/areAABBsOverlapping.js';
import { findBroadPhasePairs } from '#src/systems/CollisionDetection2dSystem/logic/index.js';

describe('findBroadPhasePairs', () => {
  let entityA: Entity;
  let entityB: Entity;
  let entityC: Entity;
  let colliderA: Collider2dComponent;
  let colliderB: Collider2dComponent;
  let colliderC: Collider2dComponent;

  let areAABBsOverlappingSpy: MockInstance<typeof areAABBsOverlappingModule.default>;

  beforeAll(() => {
    areAABBsOverlappingSpy = vi.spyOn(areAABBsOverlappingModule, 'default');
  });

  afterEach(() => {
    areAABBsOverlappingSpy.mockClear();
  });

  afterAll(() => {
    areAABBsOverlappingSpy.mockReset();
  });

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    entityC = new Entity();
  });

  describe('When passed an array of entities with valid components', () => {
    beforeEach(() => {
      for (const entity of [entityA, entityB, entityC]) {
        entity.addComponents([
          new Transform2dComponent(),
          new Collider2dComponent({
            shape: {
              type: 'box',
              width: 32,
              height: 32,
            },
          }),
        ]);
      }
      colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
      colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
      colliderC = entityC.getComponent<Collider2dComponent>('Collider2d');
    });

    describe('When entities have valid AABBs', () => {
      beforeEach(() => {
        for (const collider of [colliderA, colliderB, colliderC]) {
          collider.aabb = {
            min: {
              x: -16,
              y: -16,
            },
            max: {
              x: 16,
              y: 16,
            },
          };
        }
      });

      it('Should test AABB overlap for each potential pair', () => {
        findBroadPhasePairs([entityA, entityB, entityC]);
        expect(areAABBsOverlappingSpy).toHaveBeenCalledWith(colliderA.aabb, colliderB.aabb);
        expect(areAABBsOverlappingSpy).toHaveBeenCalledWith(colliderA.aabb, colliderC.aabb);
        expect(areAABBsOverlappingSpy).toHaveBeenCalledWith(colliderB.aabb, colliderC.aabb);
        areAABBsOverlappingSpy.mockRestore();
      });

      describe('When entity AABBs are overlapping', () => {
        beforeEach(() => {
          for (const collider of [colliderA, colliderB, colliderC]) {
            collider.aabb = {
              min: {
                x: -16,
                y: -16,
              },
              max: {
                x: 16,
                y: 16,
              },
            };
          }
        });

        it('Should return them as candidate pairs', () => {
          const candidatePairs = findBroadPhasePairs([entityA, entityB, entityC]);
          expect(candidatePairs).toEqual([
            [entityA, entityB],
            [entityA, entityC],
            [entityB, entityC],
          ]);
        });
      });

      describe('When entity AABBs are not overlapping', () => {
        beforeEach(() => {
          colliderA.aabb = {
            min: {
              x: -16,
              y: -16,
            },
            max: {
              x: 16,
              y: 16,
            },
          };
          colliderB.aabb = {
            min: {
              x: 32,
              y: 32,
            },
            max: {
              x: 64,
              y: 64,
            },
          };
          colliderC.aabb = {
            min: {
              x: 128,
              y: 128,
            },
            max: {
              x: 160,
              y: 160,
            },
          };
        });

        it('Should not return them as candidate pairs', () => {
          const candidatePairs = findBroadPhasePairs([entityA, entityB, entityC]);
          expect(candidatePairs).toEqual([]);
        });
      });
    });

    describe('When entities are missing AABBs', () => {
      it('Should return all potential pairs as candidate pairs', () => {
        const candidatePairs = findBroadPhasePairs([entityA, entityB, entityC]);
        expect(candidatePairs).toEqual([
          [entityA, entityB],
          [entityA, entityC],
          [entityB, entityC],
        ]);
      });
    });
  });

  describe('When passed an array of entities with missing components', () => {
    it('Should not return them as candidate pairs', () => {
      const candidatePairs = findBroadPhasePairs([entityA, entityB, entityC]);
      expect(candidatePairs).toEqual([]);
    });
  });
});
