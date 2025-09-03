import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { collision2dSystem } from '#/systems';
import * as checkCollision from '#/systems/collision2dSystem/logic/checkCollision';
import * as resolveCollision from '#/systems/collision2dSystem/logic/resolveCollision';

describe('collision2dSystem', () => {
  let entityA: Entity;
  let entityB: Entity;

  let checkCollisionSpy: MockInstance<typeof checkCollision.default>;
  let resolveCollisionSpy: MockInstance<typeof resolveCollision.default>;

  beforeAll(() => {
    checkCollisionSpy = vi.spyOn(checkCollision, 'default');
    resolveCollisionSpy = vi.spyOn(resolveCollision, 'default');
  });

  afterEach(() => {
    checkCollisionSpy.mockReset();
    resolveCollisionSpy.mockReset();
  });

  afterAll(() => {
    checkCollisionSpy.mockRestore();
    resolveCollisionSpy.mockRestore();
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
      collision2dSystem([entityA, entityB]);
      expect(checkCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    });

    it('Should resolve collisions between colliding entities', () => {
      checkCollisionSpy.mockImplementationOnce(() => true);
      collision2dSystem([entityA, entityB]);
      expect(resolveCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    });

    it('Should not resolve collisions between non-colliding entities', () => {
      checkCollisionSpy.mockImplementationOnce(() => false);
      collision2dSystem([entityA, entityB]);
      expect(resolveCollisionSpy).not.toHaveBeenCalled();
    });
  });

  describe('When passed entities without required components', () => {
    beforeEach(() => {
      entityA = new Entity();
      entityB = new Entity();
    });

    it('Should not check for collisions', () => {
      collision2dSystem([entityA, entityB]);
      expect(checkCollisionSpy).not.toHaveBeenCalled();
    });

    it('Should not resolve collisions', () => {
      collision2dSystem([entityA, entityB]);
      expect(resolveCollisionSpy).not.toHaveBeenCalled();
    });
  });
});