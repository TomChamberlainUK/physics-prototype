import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { collisionDetection2dSystem } from '#/systems';
import * as getCollision from '#/systems/collisionDetection2dSystem/logic/getCollision';
import { Vector2d } from '#/maths';

describe('collisionDetection2dSystem', () => {
  let entityA: Entity;
  let entityB: Entity;

  let getCollisionSpy: MockInstance<typeof getCollision.default>;

  beforeAll(() => {
    getCollisionSpy = vi.spyOn(getCollision, 'default');
  });

  afterEach(() => {
    getCollisionSpy.mockReset();
  });

  afterAll(() => {
    getCollisionSpy.mockRestore();
  });

  describe('When passed entities with required components', () => {
    beforeEach(() => {
      entityA = new Entity();
      entityB = new Entity();
      [entityA, entityB].forEach(entity => {
        entity.addComponents([
          new Collider2dComponent({
            shape: {
              type: 'circle',
              radius: 16
            }
          }),
          new RigidBody2dComponent(),
          new Transform2dComponent(),
        ]);
      });
    });

    it('Should check for collisions between entities', () => {
      collisionDetection2dSystem([entityA, entityB]);
      expect(getCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    });

    it('Should return collision pairs for colliding entities', () => {
      getCollisionSpy.mockImplementationOnce(() => ({
        isColliding: true,
        normal: new Vector2d({ x: 1, y: 0 }),
        overlap: 5
      }));
      const collisionPairs = collisionDetection2dSystem([entityA, entityB]);
      expect(collisionPairs).toEqual([{
        entityA,
        entityB,
        normal: { x: 1, y: 0 },
        overlap: 5
      }]);
    });

    it('Should return no collision pairs for non-colliding entities', () => {
      getCollisionSpy.mockImplementationOnce(() => ({
        isColliding: false
      }));
      const collisionPairs = collisionDetection2dSystem([entityA, entityB]);
      expect(collisionPairs).toEqual([]);
    });
  });

  describe('When passed entities without required components', () => {
    beforeEach(() => {
      entityA = new Entity();
      entityB = new Entity();
    });

    it('Should not check for collisions', () => {
      collisionDetection2dSystem([entityA, entityB]);
      expect(getCollisionSpy).not.toHaveBeenCalled();
    });

    it('Should return no collision pairs', () => {
      const collisionPairs = collisionDetection2dSystem([entityA, entityB]);
      expect(collisionPairs).toEqual([]);
    });
  });
});