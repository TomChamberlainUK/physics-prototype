import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { getCircleCircleCollision } from '#/systems/CollisionDetection2dSystem/logic';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getCircleCircleCollision', () => {
  const radius = 16;

  let entityA: Entity;
  let entityB: Entity;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    const colliderA = new Collider2dComponent({
      shape: {
        type: 'circle',
        radius,
      },
    });
    const colliderB = new Collider2dComponent({
      shape: {
        type: 'circle',
        radius,
      },
    });
    transformA = new Transform2dComponent();
    transformB = new Transform2dComponent();
    entityA.addComponents([colliderA, transformA]);
    entityB.addComponents([colliderB, transformB]);
  });

  describe('When passed two colliding circles', () => {
    const overlap = 16;

    beforeEach(() => {
      transformB.position = new Vector2d({
        x: (radius * 2) - overlap,
        y: 0,
      });
    });

    it('Should return that the circles are colliding', () => {
      const collision = getCircleCircleCollision(entityA, entityB);
      expect(collision.isColliding).toBe(true);
    });

    it('Should return the collision normal', () => {
      const collision = getCircleCircleCollision(entityA, entityB);
      if (!collision.isColliding) {
        throw new Error('Expected circles to be colliding');
      }
      expect(collision.normal).toEqual(new Vector2d({ x: -1, y: 0 }));
    });

    it('Should return the overlap distance', () => {
      const collision = getCircleCircleCollision(entityA, entityB);
      if (!collision.isColliding) {
        throw new Error('Expected circles to be colliding');
      }
      expect(collision.overlap).toBe(overlap);
    });

    it('Should return the contact point', () => {
      const collision = getCircleCircleCollision(entityA, entityB);
      if (!collision.isColliding) {
        throw new Error('Expected circles to be colliding');
      }
      const expectedContactPoint = transformA.position.subtract(collision.normal.multiply(radius));
      expect(collision.contactPoint).toEqual(expectedContactPoint);
    });
  });

  describe('When passed two circles that are not colliding', () => {
    beforeEach(() => {
      transformB.position = new Vector2d({
        x: (radius * 2) + 10,
        y: 0,
      });
    });

    it('Should return that the circles are not colliding', () => {
      const collision = getCircleCircleCollision(entityA, entityB);
      expect(collision.isColliding).toBe(false);
    });
  });
});
