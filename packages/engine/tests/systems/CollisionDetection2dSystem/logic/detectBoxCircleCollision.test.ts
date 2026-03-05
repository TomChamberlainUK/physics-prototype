import { beforeEach, describe, expect, it } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { Vector2d } from '#src/maths/index.js';
import { computeWorldVertices } from '#src/systems/ColliderUpdate2dSystem/logic/index.js';
import { detectBoxCircleCollision } from '#src/systems/CollisionDetection2dSystem/logic/index.js';
import { isPointNearConvexPolygon } from '../../../utils/index.js';

describe('detectBoxCircleCollision', () => {
  const width = 50;
  const height = 50;
  const halfWidth = width / 2;
  const radius = 25;

  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;
  let colliderA: Collider2dComponent;
  let colliderB: Collider2dComponent;

  let result: ReturnType<typeof detectBoxCircleCollision>;

  beforeEach(() => {
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
  });

  describe('When passed an axis-aligned box entity with colliding world vertices to a circle', () => {
    const overlap = 16;

    beforeEach(() => {
      transformB.position.x = width - overlap;
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      result = detectBoxCircleCollision({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
    });

    it('Should detect a collision', () => {
      expect(result.isColliding).toBe(true);
    });

    it('Should return the collision normal pointing from B to A', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.contactManifold.normal).toEqual({ x: -1, y: 0 });
    });

    it('Should return the overlap distance', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.contactManifold.overlap).toBe(overlap);
    });

    it('Should return contact points', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.contactManifold.contactPoints).toContainEqual(new Vector2d({ x: halfWidth, y: 0 }));
      expect(result.contactManifold.contactPoints.length).toBe(1);
    });
  });

  describe('When passed an axis-aligned box entity with non-colliding world vertices to a circle', () => {
    const gap = 16;

    beforeEach(() => {
      transformB.position.x = width + gap;
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      result = detectBoxCircleCollision({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
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
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      result = detectBoxCircleCollision({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
    });

    it('Should detect a collision', () => {
      expect(result.isColliding).toBe(true);
    });

    it('Should return the collision normal pointing from B to A', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.contactManifold.normal).toBeInstanceOf(Vector2d);
      const centerDelta = transformA.position.subtract(transformB.position);
      const dot = centerDelta.x * result.contactManifold.normal.x + centerDelta.y * result.contactManifold.normal.y;
      expect(dot).toBeGreaterThan(0);
    });

    it('Should return the overlap distance', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      expect(result.contactManifold.overlap).toBeGreaterThan(overlap);
    });

    it('Should return contact points', () => {
      if (!result.isColliding) {
        throw new Error('Expected a collision to be detected');
      }
      for (const contactPoint of result.contactManifold.contactPoints) {
        const isWithinBox = isPointNearConvexPolygon({ point: contactPoint, polygonVertices: colliderA.worldVertices! });
        const distanceFromCircleCenter = contactPoint.subtract(transformB.position);
        expect(isWithinBox).toBe(true);
        expect(distanceFromCircleCenter.getLengthSquared()).toBeLessThanOrEqual(radius * radius);
      }
    });
  });

  describe('When passed a rotated box entity with non-colliding world vertices to a circle', () => {
    const gap = 16;

    beforeEach(() => {
      transformA.rotation = Math.PI / 4; // 45 degrees
      transformB.position.x = width + gap;
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      result = detectBoxCircleCollision({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
    });

    it('Should return no collision data when passed two non-colliding boxes', () => {
      expect(result).toEqual({
        isColliding: false,
      });
    });
  });
});
