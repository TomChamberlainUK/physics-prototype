import { beforeEach, describe, expect, it } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { Vector2d } from '#src/maths/index.js';
import { detectBoxBoxCollision, isPointInConvexPolygon } from '#src/systems/CollisionDetection2dSystem/logic/index.js';
import { computeWorldVertices } from '#src/systems/ColliderUpdate2dSystem/logic/index.js';

describe('detectBoxBoxCollision', () => {
  const width = 50;
  const height = 50;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;
  let colliderA: Collider2dComponent;
  let colliderB: Collider2dComponent;

  let result: ReturnType<typeof detectBoxBoxCollision>;

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
        type: 'box',
        width,
        height,
      },
    });
  });

  describe('When passed axis-aligned entities with colliding world vertices', () => {
    const overlap = 16;

    beforeEach(() => {
      transformB.position.x = width - overlap;
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      colliderB.worldVertices = computeWorldVertices({ collider: colliderB, transform: transformB });
      result = detectBoxBoxCollision({
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

    it('Should return the two most significant contact points of the collision', () => {
      if (!result.isColliding || !result.contactManifold.contactPoints) {
        throw new Error('Expected a collision to be detected');
      }
      const expectedContactPoints = [
        new Vector2d(halfWidth, -halfHeight),
        new Vector2d(halfWidth - overlap, -halfHeight),
      ];
      for (const expectedContactPoint of expectedContactPoints) {
        expect(result.contactManifold.contactPoints).toContainEqual(expectedContactPoint);
      }
      for (const contactPoint of result.contactManifold.contactPoints) {
        const isWithinBoxA = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderA.worldVertices! });
        const isWithinBoxB = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderB.worldVertices! });
        expect(isWithinBoxA).toBe(true);
        expect(isWithinBoxB).toBe(true);
      }
      expect(result.contactManifold.contactPoints.length).toBe(expectedContactPoints.length);
    });
  });

  describe('When passed axis-aligned entities with non-colliding world vertices', () => {
    const gap = 16;

    beforeEach(() => {
      transformB.position.x = width + gap;
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      colliderB.worldVertices = computeWorldVertices({ collider: colliderB, transform: transformB });
      result = detectBoxBoxCollision({
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

  describe('When passed rotated entities with colliding world vertices', () => {
    const overlap = 16;

    beforeEach(() => {
      transformA.rotation = Math.PI / 4; // 45 degrees
      transformB.position.x = width - overlap;
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      colliderB.worldVertices = computeWorldVertices({ collider: colliderB, transform: transformB });
      result = detectBoxBoxCollision({
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

    it('Should return the contact points of the collision', () => {
      if (!result.isColliding || !result.contactManifold.contactPoints) {
        throw new Error('Expected a collision to be detected');
      }
      for (const contactPoint of result.contactManifold.contactPoints) {
        const isWithinBoxA = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderA.worldVertices! });
        const isWithinBoxB = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderB.worldVertices! });
        expect(isWithinBoxA).toBe(true);
        expect(isWithinBoxB).toBe(true);
      }
      expect(result.contactManifold.contactPoints.length).toBeGreaterThan(0);
    });
  });

  describe('When passed rotated entities with non-colliding world vertices', () => {
    const gap = 16;

    beforeEach(() => {
      transformA.rotation = Math.PI / 4; // 45 degrees
      transformB.position.x = width + gap;
      colliderA.worldVertices = computeWorldVertices({ collider: colliderA, transform: transformA });
      colliderB.worldVertices = computeWorldVertices({ collider: colliderB, transform: transformB });
      result = detectBoxBoxCollision({
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
