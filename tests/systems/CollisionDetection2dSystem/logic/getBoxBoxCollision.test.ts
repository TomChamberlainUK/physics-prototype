import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { getBoxBoxCollision } from '#/systems/CollisionDetection2dSystem/logic';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getBoxBoxCollision', () => {
  let entityA: Entity;
  let entityB: Entity;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    [entityA, entityB].forEach(entity => {
      entity.addComponents([
        new Collider2dComponent({
          shape: {
            type: 'box',
            width: 32,
            height: 32
          }
        }),
        new Transform2dComponent()
      ]);
    });
    transformA = entityA.getComponent('Transform2d');
    transformB = entityB.getComponent('Transform2d');
  });

  it('Should return correct collision data when passed two colliding boxes', () => {
    transformA.position.x = 0;
    transformA.position.y = 0;
    transformB.position.x = 16;
    transformB.position.y = 0;

    const result = getBoxBoxCollision(entityA, entityB);

    expect(result).toEqual({
      isColliding: true,
      normal: { x: -1, y: 0 },
      overlap: 16
    });
  });

  it('Should return no collision data when passed two non-colliding boxes', () => {
    transformA.position.x = 0;
    transformA.position.y = 0;
    transformB.position.x = 100;
    transformB.position.y = 0;

    const result = getBoxBoxCollision(entityA, entityB);

    expect(result).toEqual({
      isColliding: false
    });
  });
});