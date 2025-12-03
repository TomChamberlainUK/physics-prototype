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

  let result: ReturnType<typeof getCircleCircleCollision>;

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
      result = getCircleCircleCollision(entityA, entityB);
    });

    it('Should detect a collision', () => {
      expect(result.isColliding).toBe(true);
    });

    it('Should return the collision normal pointing from B to A', () => {
      if (!result.isColliding) {
        throw new Error('Expected circles to be colliding');
      }
      expect(result.contactManifold.normal).toEqual(new Vector2d({ x: -1, y: 0 }));
    });

    it('Should return the overlap distance', () => {
      if (!result.isColliding) {
        throw new Error('Expected circles to be colliding');
      }
      expect(result.contactManifold.overlap).toBe(overlap);
    });

    it('Should return contact points', () => {
      if (!result.isColliding) {
        throw new Error('Expected circles to be colliding');
      }
      for (const contactPoint of result.contactManifold.contactPoints) {
        const distanceFromCenterA = contactPoint.subtract(transformA.position);
        const distanceFromCenterB = contactPoint.subtract(transformB.position);
        expect(distanceFromCenterA.getLengthSquared()).toBeLessThanOrEqual(radius * radius);
        expect(distanceFromCenterB.getLengthSquared()).toBeLessThanOrEqual(radius * radius);
      }
    });
  });

  describe('When passed two circles that are not colliding', () => {
    beforeEach(() => {
      transformB.position = new Vector2d({
        x: (radius * 2) + 10,
        y: 0,
      });
      result = getCircleCircleCollision(entityA, entityB);
    });

    it('Should return that the circles are not colliding', () => {
      expect(result.isColliding).toBe(false);
    });
  });
});
