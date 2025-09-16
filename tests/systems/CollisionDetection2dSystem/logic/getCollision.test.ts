import { afterAll, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent } from '#/components';
import Entity from '#/Entity';
import { getCollision } from '#/systems/CollisionDetection2dSystem/logic';
import * as getBoxBoxCollision from '#/systems/CollisionDetection2dSystem/logic/getBoxBoxCollision';
import * as getBoxCircleCollision from '#/systems/CollisionDetection2dSystem/logic/getBoxCircleCollision';
import * as getCircleCircleCollision from '#/systems/CollisionDetection2dSystem/logic/getCircleCircleCollision';

describe('getCollision', () => {
  let entityA: Entity;
  let entityB: Entity;
  let getBoxBoxCollisionSpy: MockInstance<typeof getBoxBoxCollision.default>;
  let getBoxCircleCollisionSpy: MockInstance<typeof getBoxCircleCollision.default>;
  let getCircleCircleCollisionSpy: MockInstance<typeof getCircleCircleCollision.default>;

  beforeAll(() => {
    getBoxBoxCollisionSpy = vi.spyOn(getBoxBoxCollision, 'default');
    getBoxCircleCollisionSpy = vi.spyOn(getBoxCircleCollision, 'default');
    getCircleCircleCollisionSpy = vi.spyOn(getCircleCircleCollision, 'default');
  });

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
  });

  afterAll(() => {
    getBoxBoxCollisionSpy.mockRestore();
    getBoxCircleCollisionSpy.mockRestore();
    getCircleCircleCollisionSpy.mockRestore();
  });

  it.each([
    {
      isColliding: true
    },
    {
      isColliding: false
    }
  ])('Should return collision data for two circles when isColliding is $isColliding', ({ isColliding }) => {
    const radius = 16;

    [entityA, entityB].forEach(entity => {
      entity.addComponents([
        new Collider2dComponent({
          shape: {
            type: 'circle',
            radius
          }
        }),
      ]);
    });
    getCircleCircleCollisionSpy.mockImplementation(() => ({ isColliding }));

    const result = getCollision(entityA, entityB);

    expect(getCircleCircleCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result.isColliding).toEqual(isColliding);
  });

  it.each([
    {
      isColliding: true,
    },
    {
      isColliding: false,
    }
  ])('Should return collision data for two boxes when isColliding is $isColliding', ({ isColliding }) => {
    const width = 32;
    const height = 32;

    [entityA, entityB].forEach(entity => {
      entity.addComponents([
        new Collider2dComponent({
          shape: {
            type: 'box',
            width,
            height
          }
        }),
      ]);
    });
    getBoxBoxCollisionSpy.mockImplementation(() => ({ isColliding }));

    const result = getCollision(entityA, entityB);

    expect(getBoxBoxCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result.isColliding).toEqual(isColliding);
  });
  
  it.each([
    {
      isColliding: true,
    },
    {
      isColliding: false,
    }
  ])('Should return collision data for a box and a circle when isColliding is $isColliding', ({ isColliding }) => {
    const boxWidth = 32;
    const boxHeight = 32;
    const circleRadius = 16;
    
    entityA.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'box',
          width: boxWidth,
          height: boxHeight
        }
      }),
    ]);
    entityB.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: circleRadius
        }
      }),
    ]);

    getBoxCircleCollisionSpy.mockImplementation(() => ({ isColliding }));
    const result = getCollision(entityA, entityB);

    expect(getBoxCircleCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result.isColliding).toEqual(isColliding);
  });

  it.each([
    {
      isColliding: true,
    },
    {
      isColliding: false,
    }
  ])('Should return collision data for a circle and a box when isColliding is $isColliding', ({ isColliding }) => {
    const boxWidth = 32;
    const boxHeight = 32;
    const circleRadius = 16;
    
    entityA.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: circleRadius
        }
      }),
    ]);
    entityB.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'box',
          width: boxWidth,
          height: boxHeight
        }
      }),
    ]);

    getBoxCircleCollisionSpy.mockImplementation(() => ({ isColliding }));
    const result = getCollision(entityA, entityB);

    expect(getBoxCircleCollisionSpy).toHaveBeenCalledWith(entityA, entityB);
    expect(result.isColliding).toEqual(isColliding);
  });
});
