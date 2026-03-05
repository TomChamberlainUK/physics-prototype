import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { Vector2d } from '#src/maths/index.js';
import { detectCollision } from '#src/systems/CollisionDetection2dSystem/logic/index.js';
import * as detectBoxBoxCollision from '#src/systems/CollisionDetection2dSystem/logic/detectBoxBoxCollision.js';
import * as detectBoxCircleCollision from '#src/systems/CollisionDetection2dSystem/logic/detectBoxCircleCollision.js';
import * as detectCircleCircleCollision from '#src/systems/CollisionDetection2dSystem/logic/detectCircleCircleCollision.js';

describe('detectCollision', () => {
  let colliderA: Collider2dComponent;
  let colliderB: Collider2dComponent;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;

  let detectBoxBoxCollisionSpy: MockInstance<typeof detectBoxBoxCollision.default>;
  let detectBoxCircleCollisionSpy: MockInstance<typeof detectBoxCircleCollision.default>;
  let detectCircleCircleCollisionSpy: MockInstance<typeof detectCircleCircleCollision.default>;

  const expectedCollision = {
    isColliding: true,
    contactManifold: {
      normal: new Vector2d({ x: 1, y: 0 }),
      overlap: 5,
      contactPoints: [
        new Vector2d({ x: 0, y: 0 }),
        new Vector2d({ x: 1, y: 1 }),
      ],
    },
  };

  beforeAll(() => {
    detectBoxBoxCollisionSpy = vi.spyOn(detectBoxBoxCollision, 'default');
    detectBoxCircleCollisionSpy = vi.spyOn(detectBoxCircleCollision, 'default');
    detectCircleCircleCollisionSpy = vi.spyOn(detectCircleCircleCollision, 'default');
  });

  beforeEach(() => {
    transformA = new Transform2dComponent();
    transformB = new Transform2dComponent();
  });

  afterEach(() => {
    detectBoxBoxCollisionSpy.mockClear();
    detectBoxCircleCollisionSpy.mockClear();
    detectCircleCircleCollisionSpy.mockClear();
  });

  afterAll(() => {
    detectBoxBoxCollisionSpy.mockRestore();
    detectBoxCircleCollisionSpy.mockRestore();
    detectCircleCircleCollisionSpy.mockRestore();
  });

  describe('When passed two entities with box colliders', () => {
    beforeEach(() => {
      colliderA = new Collider2dComponent({
        shape: {
          type: 'box',
          width: 32,
          height: 32,
        },
      });
      colliderB = new Collider2dComponent({
        shape: {
          type: 'box',
          width: 32,
          height: 32,
        },
      });
    });

    it('Should detect a box-box collision', () => {
      detectBoxBoxCollisionSpy.mockImplementation(() => expectedCollision);
      const collision = detectCollision({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
      expect(collision).toEqual(expectedCollision);
      expect(detectBoxBoxCollisionSpy).toHaveBeenCalledWith({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
    });
  });

  describe('When passed two entities with circle colliders', () => {
    beforeEach(() => {
      colliderA = new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        },
      });
      colliderB = new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        },
      });
    });

    it('Should detect a circle-circle collision', () => {
      detectCircleCircleCollisionSpy.mockImplementation(() => expectedCollision);
      const collision = detectCollision({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
      expect(collision).toEqual(expectedCollision);
      expect(detectCircleCircleCollisionSpy).toHaveBeenCalledWith({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
    });
  });

  describe('When passed one entity with a box collider and one with a circle collider', () => {
    beforeEach(() => {
      colliderA = new Collider2dComponent({
        shape: {
          type: 'box',
          width: 32,
          height: 32,
        },
      });
      colliderB = new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        },
      });
    });

    it('Should detect a box-circle collision', () => {
      detectBoxCircleCollisionSpy.mockImplementation(() => expectedCollision);
      const collision = detectCollision({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
      expect(collision).toEqual(expectedCollision);
      expect(detectBoxCircleCollisionSpy).toHaveBeenCalledWith({
        colliderA,
        colliderB,
        transformA,
        transformB,
      });
    });
  });
});
