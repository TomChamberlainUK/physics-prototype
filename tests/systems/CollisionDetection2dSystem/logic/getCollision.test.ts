import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { getCollision } from '#/systems/CollisionDetection2dSystem/logic';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getCollision', () => {
  const radius = 16;

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
            type: 'circle',
            radius
          }
        }),
        new Transform2dComponent()
      ]);
    });
    transformA = entityA.getComponent('Transform2d');
    transformB = entityB.getComponent('Transform2d');
  });

  it('Should return collision data when passed two colliding entities', () => {
    const overlap = 16;
    transformB.position = new Vector2d({
      x: (radius * 2) - overlap,
      y: 0
    });
    const result = getCollision(entityA, entityB);
    expect(result).toEqual({
      isColliding: true,
      normal: new Vector2d({ x: -1, y: 0 }),
      overlap
    });
  });

  it('Should return no collision data when passed two non-colliding entities', () => {
    transformB.position = new Vector2d({
      x: (radius * 2) + 100,
      y: 0
    });
    const result = getCollision(entityA, entityB);
    expect(result).toEqual({
      isColliding: false
    });
  });
});
