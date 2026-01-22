import { afterAll, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent } from '#/components';
import Entity from '#/Entity';
import { detectCollision } from '#/systems/CollisionDetection2dSystem/logic';
import * as detectBoxBoxCollision from '#/systems/CollisionDetection2dSystem/logic/detectBoxBoxCollision';
import * as detectBoxCircleCollision from '#/systems/CollisionDetection2dSystem/logic/detectBoxCircleCollision';
import * as detectCircleCircleCollision from '#/systems/CollisionDetection2dSystem/logic/detectCircleCircleCollision';
import { Vector2d } from '#/maths';
import type { Collision } from '#/types';

describe('detectCollision', () => {
  let entityA: Entity;
  let entityB: Entity;
  let detectBoxBoxCollisionSpy: MockInstance<typeof detectBoxBoxCollision.default>;
  let detectBoxCircleCollisionSpy: MockInstance<typeof detectBoxCircleCollision.default>;
  let detectCircleCircleCollisionSpy: MockInstance<typeof detectCircleCircleCollision.default>;

  const collisions: Collision[] = [
    {
      isColliding: true,
      normal: new Vector2d({ x: 1, y: 0 }),
      overlap: 5,
      contactPoints: [new Vector2d({ x: 0, y: 0 }), new Vector2d({ x: 1, y: 1 })],
    },
    {
      isColliding: false,
    },
  ];

  beforeAll(() => {
    detectBoxBoxCollisionSpy = vi.spyOn(detectBoxBoxCollision, 'default');
    detectBoxCircleCollisionSpy = vi.spyOn(detectBoxCircleCollision, 'default');
    detectCircleCircleCollisionSpy = vi.spyOn(detectCircleCircleCollision, 'default');
  });

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
  });

  afterAll(() => {
    detectBoxBoxCollisionSpy.mockRestore();
    detectBoxCircleCollisionSpy.mockRestore();
    detectCircleCircleCollisionSpy.mockRestore();
  });

  it.each(collisions)('Should return collision data for two circles when isColliding is $isColliding', (collision) => {
    const radius = 16;

    [entityA, entityB].forEach((entity) => {
      entity.addComponents([
        new Collider2dComponent({
          shape: {
            type: 'circle',
            radius,
          },
        }),
      ]);
    });
    detectCircleCircleCollisionSpy.mockImplementation(() => collision);

    const result = detectCollision(entityA, entityB);

    expect(detectCircleCircleCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result).toEqual(collision);
  });

  it.each(collisions)('Should return collision data for two boxes when isColliding is $isColliding', (collision) => {
    const width = 32;
    const height = 32;

    [entityA, entityB].forEach((entity) => {
      entity.addComponents([
        new Collider2dComponent({
          shape: {
            type: 'box',
            width,
            height,
          },
        }),
      ]);
    });
    detectBoxBoxCollisionSpy.mockImplementation(() => (collision));

    const result = detectCollision(entityA, entityB);

    expect(detectBoxBoxCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result).toEqual(collision);
  });

  it.each(collisions)('Should return collision data for a box and a circle when isColliding is $isColliding', (collision) => {
    const boxWidth = 32;
    const boxHeight = 32;
    const circleRadius = 16;

    entityA.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'box',
          width: boxWidth,
          height: boxHeight,
        },
      }),
    ]);
    entityB.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: circleRadius,
        },
      }),
    ]);

    detectBoxCircleCollisionSpy.mockImplementation(() => (collision));
    const result = detectCollision(entityA, entityB);

    expect(detectBoxCircleCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result).toEqual(collision);
  });

  it.each(collisions)('Should return collision data for a circle and a box when isColliding is $isColliding', (collision) => {
    const boxWidth = 32;
    const boxHeight = 32;
    const circleRadius = 16;

    entityA.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: circleRadius,
        },
      }),
    ]);
    entityB.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'box',
          width: boxWidth,
          height: boxHeight,
        },
      }),
    ]);

    detectBoxCircleCollisionSpy.mockImplementation(() => (collision));
    const result = detectCollision(entityA, entityB);

    expect(detectBoxCircleCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result).toEqual(collision);
  });
});
