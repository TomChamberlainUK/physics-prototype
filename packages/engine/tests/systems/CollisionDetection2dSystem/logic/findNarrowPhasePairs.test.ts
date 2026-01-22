import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Entity from '#/Entity';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import { Vector2d } from '#/maths';
import * as detectCollisionModule from '#/systems/CollisionDetection2dSystem/logic/detectCollision';
import findNarrowPhasePairs from '#/systems/CollisionDetection2dSystem/logic/findNarrowPhasePairs';

describe('findNarrowPhasePairs', () => {
  let entityA: Entity;
  let entityB: Entity;
  let entityC: Entity;

  let detectCollisionSpy: MockInstance<typeof detectCollisionModule.default>;

  beforeAll(() => {
    detectCollisionSpy = vi.spyOn(detectCollisionModule, 'default');
  });

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    entityC = new Entity();
    for (const entity of [entityA, entityB, entityC]) {
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

  afterEach(() => {
    detectCollisionSpy.mockClear();
  });

  afterAll(() => {
    detectCollisionSpy.mockRestore();
  });

  it('Should test collision for each candidate pair', () => {
    findNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
    expect(detectCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(detectCollisionSpy).toHaveBeenCalledWith(entityA, entityC);
    expect(detectCollisionSpy).toHaveBeenCalledWith(entityB, entityC);
  });

  describe('When entities are colliding', () => {
    beforeEach(() => {
      detectCollisionSpy.mockReturnValue({
        isColliding: true,
        contactManifold: {
          normal: new Vector2d({ x: 0, y: 1 }),
          overlap: 1,
          contactPoints: [new Vector2d({ x: 0, y: 0 })],
        },
      });
    });

    it('Should return them as collision pairs with contact manifolds', () => {
      const collisionPairs = findNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
      expect(collisionPairs).toEqual([
        {
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: 1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        },
        {
          entityA,
          entityB: entityC,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: 1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        },
        {
          entityA: entityB,
          entityB: entityC,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: 1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        },
      ]);
    });
  });

  describe('When entities are not colliding', () => {
    beforeEach(() => {
      detectCollisionSpy.mockReturnValue({
        isColliding: false,
      });
    });

    it('Should not return them as collision pairs', () => {
      const collisionPairs = findNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
      expect(collisionPairs).toEqual([]);
    });
  });
});
