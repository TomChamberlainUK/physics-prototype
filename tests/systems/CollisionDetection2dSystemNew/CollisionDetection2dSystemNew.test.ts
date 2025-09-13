import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { CollisionDetection2dSystem } from '#/systems';
import * as getCollision from '#/systems/CollisionDetection2dSystemNew/logic/getCollision';
import { Vector2d } from '#/maths';

describe('CollisionDetection2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new CollisionDetection2dSystem();
      expect(system).toBeInstanceOf(CollisionDetection2dSystem);
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    let collisionDetection2dSystem: CollisionDetection2dSystem;
    let entityA: Entity;
    let entityB: Entity;
  
    let getCollisionSpy: MockInstance<typeof getCollision.default>;
  
    beforeAll(() => {
      getCollisionSpy = vi.spyOn(getCollision, 'default');
    });

    beforeEach(() => {
      collisionDetection2dSystem = new CollisionDetection2dSystem();
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
        collisionDetection2dSystem.update([entityA, entityB], {});
        expect(getCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
      });

      it('Should update context collision pairs for colliding entities', () => {
        const context = {
          collisionPairs: []
        };
        getCollisionSpy.mockImplementationOnce(() => ({
          isColliding: true,
          normal: new Vector2d({ x: 1, y: 0 }),
          overlap: 5
        }));
        collisionDetection2dSystem.update([entityA, entityB], context);
        expect(context.collisionPairs).toEqual([{
          entityA,
          entityB,
          normal: { x: 1, y: 0 },
          overlap: 5
        }]);
      });

      it('Should not update context collision pairs for non-colliding entities', () => {
        getCollisionSpy.mockImplementationOnce(() => ({
          isColliding: false
        }));
        const context = {
          collisionPairs: []
        };
        collisionDetection2dSystem.update([entityA, entityB], context);
        expect(context.collisionPairs).toEqual([]);
      });
    });
  
    describe('When passed entities without required components', () => {
      beforeEach(() => {
        entityA = new Entity();
        entityB = new Entity();
      });
  
      it('Should not check for collisions', () => {
        collisionDetection2dSystem.update([entityA, entityB], {});
        expect(getCollisionSpy).not.toHaveBeenCalled();
      });

      it('Should not update context collision pairs', () => {
        const context = {
          collisionPairs: []
        };
        collisionDetection2dSystem.update([entityA, entityB], context);
        expect(context.collisionPairs).toEqual([]);
      });
    });
  });
});