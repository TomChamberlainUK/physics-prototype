import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Entity from '#src/Entity.js';
import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { Vector2d } from '#src/maths/index.js';
import * as detectCollisionModule from '#src/systems/CollisionDetection2dSystem/logic/detectCollision.js';
import { findNarrowPhasePairs } from '#src/systems/CollisionDetection2dSystem/logic/index.js';

describe('findNarrowPhasePairs', () => {
  let entityA: Entity;
  let entityB: Entity;
  let entityC: Entity;
  let colliderA: Collider2dComponent;
  let colliderB: Collider2dComponent;
  let colliderC: Collider2dComponent;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;
  let transformC: Transform2dComponent;

  let detectCollisionSpy: MockInstance<typeof detectCollisionModule.default>;

  beforeAll(() => {
    detectCollisionSpy = vi.spyOn(detectCollisionModule, 'default');
  });

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    entityC = new Entity();
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
    colliderC = new Collider2dComponent({
      shape: {
        type: 'circle',
        radius: 16,
      },
    });
    transformA = new Transform2dComponent();
    transformB = new Transform2dComponent();
    transformC = new Transform2dComponent();
    entityA.addComponents([colliderA, transformA]);
    entityB.addComponents([colliderB, transformB]);
    entityC.addComponents([colliderC, transformC]);
  });

  afterEach(() => {
    detectCollisionSpy.mockClear();
  });

  afterAll(() => {
    detectCollisionSpy.mockRestore();
  });

  it('Should test collision for each candidate pair', () => {
    findNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
    expect(detectCollisionSpy).toHaveBeenCalledWith({
      colliderA,
      colliderB,
      transformA,
      transformB,
    });
    expect(detectCollisionSpy).toHaveBeenCalledWith({
      colliderA,
      colliderB: colliderC,
      transformA,
      transformB: transformC,
    });
    expect(detectCollisionSpy).toHaveBeenCalledWith({
      colliderA: colliderB,
      colliderB: colliderC,
      transformA: transformB,
      transformB: transformC,
    });
  });

  describe('When entities are colliding', () => {
    beforeEach(() => {
      detectCollisionSpy.mockReturnValue({
        isColliding: true,
        contactManifold: {
          normal: new Vector2d({ x: 0, y: 1 }),
          overlap: 1,
          contactPoints: [new Vector2d({ x: 0, y: 0 })],
        },
      });
    });

    it('Should return them as collision pairs with contact manifolds', () => {
      const collisionPairs = findNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
      expect(collisionPairs).toEqual([
        {
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: 1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        },
        {
          entityA,
          entityB: entityC,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: 1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        },
        {
          entityA: entityB,
          entityB: entityC,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: 1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        },
      ]);
    });
  });

  describe('When entities are not colliding', () => {
    beforeEach(() => {
      detectCollisionSpy.mockReturnValue({
        isColliding: false,
      });
    });

    it('Should not return them as collision pairs', () => {
      const collisionPairs = findNarrowPhasePairs([[entityA, entityB], [entityA, entityC], [entityB, entityC]]);
      expect(collisionPairs).toEqual([]);
    });
  });
});
