import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
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

  let result: ReturnType<typeof getBoxCircleCollision>;

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
      result = getBoxCircleCollision(entityA, entityB);
    });

    it('Should detect a collision', () => {
      expect(result.isColliding).toBe(true);
    });

    it('Should return the collision normal pointing from B to A', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.normal).toEqual({ x: -1, y: 0 });
    });

    it('Should return the overlap distance', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.overlap).toBe(overlap);
    });
  });

  describe('When passed an axis-aligned box entity with non-colliding world vertices to a circle', () => {
    const gap = 16;

    beforeEach(() => {
      transformB.position.x = width + gap;
      colliderA.worldVertices = getWorldVertices(entityA);
      result = getBoxCircleCollision(entityA, entityB);
    });

    it('Should return no collision data when passed two non-colliding boxes', () => {
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
      result = getBoxCircleCollision(entityA, entityB);
    });

    it('Should detect a collision', () => {
      expect(result.isColliding).toBe(true);
    });

    it('Should return the collision normal pointing from B to A', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.normal).toBeInstanceOf(Vector2d);
      const centerDelta = transformA.position.subtract(transformB.position);
      const dot = centerDelta.x * result.normal.x + centerDelta.y * result.normal.y;
      expect(dot).toBeGreaterThan(0);
    });

    it('Should return the overlap distance', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
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
      result = getBoxCircleCollision(entityA, entityB);
    });

    it('Should return no collision data when passed two non-colliding boxes', () => {
      expect(result).toEqual({
        isColliding: false,
      });
    });
  });
});
