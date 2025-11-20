import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import getWorldVertices from '#/systems/ColliderUpdate2dSystem/logic/getWorldVertices';
import { getBoxCircleCollision } from '#/systems/CollisionDetection2dSystem/logic';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getBoxCircleCollision', () => {
  const width = 50;
  const height = 50;
  const radius = 25;

  let entityA: Entity;
  let entityB: Entity;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;
  let colliderA: Collider2dComponent;
  let colliderB: Collider2dComponent;

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    transformA = new Transform2dComponent();
    transformB = new Transform2dComponent();
    colliderA = new Collider2dComponent({
      shape: {
        type: 'box',
        width,
        height,
      },
    });
    colliderB = new Collider2dComponent({
      shape: {
        type: 'circle',
        radius,
      },
    });
    entityA.addComponents([
      transformA,
      colliderA,
    ]);
    entityB.addComponents([
      transformB,
      colliderB,
    ]);
  });

  describe('When passed an axis-aligned box entity with colliding world vertices to a circle', () => {
    const overlap = 16;

    beforeEach(() => {
      transformB.position.x = width - overlap;
      colliderA.worldVertices = getWorldVertices(entityA);
    });

    it('Should return collision data', () => {
      const result = getBoxCircleCollision(entityA, entityB);
      expect(result).toEqual({
        isColliding: true,
        normal: { x: -1, y: 0 },
        overlap: overlap,
      });
    });
  });

  describe('When passed an axis-aligned box entity with non-colliding world vertices to a circle', () => {
    const gap = 16;

    beforeEach(() => {
      transformB.position.x = width + gap;
      colliderA.worldVertices = getWorldVertices(entityA);
    });

    it('Should return no collision data when passed two non-colliding boxes', () => {
      const result = getBoxCircleCollision(entityA, entityB);
      expect(result).toEqual({
        isColliding: false,
      });
    });
  });

  describe('When passed a rotated box entity with colliding world vertices to a circle', () => {
    const overlap = 16;

    beforeEach(() => {
      transformA.rotation = Math.PI / 4; // 45 degrees
      transformB.position.x = width - overlap;
      colliderA.worldVertices = getWorldVertices(entityA);
    });

    it('Should return collision data', () => {
      const result = getBoxCircleCollision(entityA, entityB);
      expect(result).toEqual({
        isColliding: true,
        normal: expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        }),
        overlap: expect.any(Number),
      });

      if (!result.isColliding || !result.normal || !result.overlap) {
        throw new Error('Expected collision data to be defined');
      }

      expect(result.overlap).toBeGreaterThan(overlap);
    });
  });

  describe('When passed a rotated box entity with non-colliding world vertices to a circle', () => {
    const gap = 16;

    beforeEach(() => {
      transformA.rotation = Math.PI / 4; // 45 degrees
      transformB.position.x = width + gap;
      colliderA.worldVertices = getWorldVertices(entityA);
    });

    it('Should return no collision data when passed two non-colliding boxes', () => {
      const result = getBoxCircleCollision(entityA, entityB);
      expect(result).toEqual({
        isColliding: false,
      });
    });
  });
});
