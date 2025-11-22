import { beforeEach, describe, expect, it } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { getBoxBoxCollision, isPointInConvexPolygon } from '#/systems/CollisionDetection2dSystem/logic';
import { getWorldVertices } from '#/systems/ColliderUpdate2dSystem/logic';

describe('getBoxBoxCollision', () => {
  const width = 50;
  const height = 50;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  let entityA: Entity;
  let entityB: Entity;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;
  let colliderA: Collider2dComponent;
  let colliderB: Collider2dComponent;

  let result: ReturnType<typeof getBoxBoxCollision>;

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
        type: 'box',
        width,
        height,
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

  describe('When passed axis-aligned entities with colliding world vertices', () => {
    const overlap = 16;

    beforeEach(() => {
      transformB.position.x = width - overlap;
      colliderA.worldVertices = getWorldVertices(entityA);
      colliderB.worldVertices = getWorldVertices(entityB);
      result = getBoxBoxCollision(entityA, entityB);
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

    it('Should return the contact points of the collision', () => {
      if (!result.isColliding || !result.contactPoints) {
        throw new Error('Expected a collision to be detected');
      }
      const expectedContactPoints = [
        new Vector2d(halfWidth, -halfHeight),
        new Vector2d(halfWidth, halfHeight),
        new Vector2d(halfWidth - overlap, -halfHeight),
        new Vector2d(halfWidth - overlap, halfHeight),
      ];
      for (const expectedContactPoint of expectedContactPoints) {
        expect(result.contactPoints).toContainEqual(expectedContactPoint);
      }
      for (const contactPoint of result.contactPoints) {
        const isWithinBoxA = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderA.worldVertices! });
        const isWithinBoxB = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderB.worldVertices! });
        expect(isWithinBoxA).toBe(true);
        expect(isWithinBoxB).toBe(true);
      }
      expect(result.contactPoints.length).toBe(expectedContactPoints.length);
    });
  });

  describe('When passed axis-aligned entities with non-colliding world vertices', () => {
    const gap = 16;

    beforeEach(() => {
      transformB.position.x = width + gap;
      colliderA.worldVertices = getWorldVertices(entityA);
      colliderB.worldVertices = getWorldVertices(entityB);
      result = getBoxBoxCollision(entityA, entityB);
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
      colliderA.worldVertices = getWorldVertices(entityA);
      colliderB.worldVertices = getWorldVertices(entityB);
      result = getBoxBoxCollision(entityA, entityB);
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

    it('Should return the contact points of the collision', () => {
      if (!result.isColliding || !result.contactPoints) {
        throw new Error('Expected a collision to be detected');
      }
      for (const contactPoint of result.contactPoints) {
        const isWithinBoxA = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderA.worldVertices! });
        const isWithinBoxB = isPointInConvexPolygon({ point: contactPoint, polygonVertices: colliderB.worldVertices! });
        expect(isWithinBoxA).toBe(true);
        expect(isWithinBoxB).toBe(true);
      }
      expect(result.contactPoints.length).toBeGreaterThan(0);
    });
  });

  describe('When passed rotated entities with non-colliding world vertices', () => {
    const gap = 16;

    beforeEach(() => {
      transformA.rotation = Math.PI / 4; // 45 degrees
      transformB.position.x = width + gap;
      colliderA.worldVertices = getWorldVertices(entityA);
      colliderB.worldVertices = getWorldVertices(entityB);
      result = getBoxBoxCollision(entityA, entityB);
    });

    it('Should return no collision data when passed two non-colliding boxes', () => {
      expect(result).toEqual({
        isColliding: false,
      });
    });
  });
});
