import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Entity from '#/Entity';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import { Vector2d } from '#/maths';
import * as getCollisionModule from '#/systems/CollisionDetection2dSystem/logic/getCollision';
import getNarrowPhasePairs from '#/systems/CollisionDetection2dSystem/logic/getNarrowPhasePairs';

describe('getNarrowPhasePairs', () => {
  let entityA: Entity;
  let entityB: Entity;
  let entityC: Entity;

  let getCollisionSpy: MockInstance<typeof getCollisionModule.default>;

  beforeAll(() => {
    getCollisionSpy = vi.spyOn(getCollisionModule, 'default');
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
    getCollisionSpy.mockClear();
  });

  afterAll(() => {
    getCollisionSpy.mockRestore();
  });

  it('Should test collision for each candidate pair', () => {
    getNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
    expect(getCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(getCollisionSpy).toHaveBeenCalledWith(entityA, entityC);
    expect(getCollisionSpy).toHaveBeenCalledWith(entityB, entityC);
  });

  describe('When entities are colliding', () => {
    beforeEach(() => {
      getCollisionSpy.mockReturnValue({
        isColliding: true,
        normal: new Vector2d({ x: 0, y: 1 }),
        overlap: 1,
        contactPoints: [new Vector2d({ x: 0, y: 0 })],
      });
    });

    it('Should return them as collision pairs with collision data', () => {
      const collisionPairs = getNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
      expect(collisionPairs).toEqual([
        {
          entityA,
          entityB,
          normal: new Vector2d({ x: 0, y: 1 }),
          overlap: 1,
          contactPoints: [new Vector2d({ x: 0, y: 0 })],
        },
        {
          entityA,
          entityB: entityC,
          normal: new Vector2d({ x: 0, y: 1 }),
          overlap: 1,
          contactPoints: [new Vector2d({ x: 0, y: 0 })],
        },
        {
          entityA: entityB,
          entityB: entityC,
          normal: new Vector2d({ x: 0, y: 1 }),
          overlap: 1,
          contactPoints: [new Vector2d({ x: 0, y: 0 })],
        },
      ]);
    });
  });

  describe('When entities are not colliding', () => {
    beforeEach(() => {
      getCollisionSpy.mockReturnValue({
        isColliding: false,
      });
    });

    it('Should not return them as collision pairs', () => {
      const collisionPairs = getNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
      expect(collisionPairs).toEqual([]);
    });
  });
});
