import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { checkCollision } from '#/systems/collision2dSystem/logic';
import { beforeEach, describe, expect, it } from 'vitest';

describe('checkCollision', () => {
  let entityA: Entity;
  let entityB: Entity;

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    [entityA, entityB].forEach(entity => {
      entity.addComponent(
        new Collider2dComponent({
          shape: {
            type: 'circle',
            radius: 16
          }
        })
      );
    });
  });

  it('Should return true when passed two colliding entities', () => {
    entityA.addComponent(
      new Transform2dComponent({
        position: new Vector2d({ x: 0, y: 0 }),
      })
    );
    entityB.addComponent(
      new Transform2dComponent({
        position: new Vector2d({ x: 0, y: 0 }),
      })
    );
    const result = checkCollision(entityA, entityB);
    expect(result).toBe(true);
  });

  it('Should return false when passed two non-colliding entities', () => {
    entityA.addComponent(
      new Transform2dComponent({
        position: new Vector2d({ x: 0, y: 0 }),
      })
    );
    entityB.addComponent(
      new Transform2dComponent({
        position: new Vector2d({ x: 100, y: 0 }),
      })
    );
    const result = checkCollision(entityA, entityB);
    expect(result).toBe(false);
  });
});
