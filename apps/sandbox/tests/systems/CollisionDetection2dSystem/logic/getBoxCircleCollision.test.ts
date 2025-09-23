import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import getBoxCircleCollision from '#/systems/CollisionDetection2dSystem/logic/getBoxCircleCollision';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getBoxCircleCollision', () => {
  let entityA: Entity;
  let entityB: Entity;
  let transform2dComponentA: Transform2dComponent;
  let transform2dComponentB: Transform2dComponent;

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    transform2dComponentA = new Transform2dComponent();
    transform2dComponentB = new Transform2dComponent();
    entityA.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'box',
          width: 32,
          height: 32,
        }
      }),
      transform2dComponentA
    ]);
    entityB.addComponents([
      new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        }
      }),
      transform2dComponentB
    ]);
  });

  it('Should return collision data when passed a colliding box and circle', () => {
    transform2dComponentB.position = new Vector2d({ x: 16, y: 0 });
    const { isColliding, normal, overlap } = getBoxCircleCollision(entityA, entityB);
    expect(isColliding).toBe(true);
    expect(normal).toEqual({ x: -1, y: 0 });
    expect(overlap).toBe(16);
  });

  it('Should return collision data when the circle center is inside the box', () => {
    transform2dComponentB.position = new Vector2d({ x: 8, y: 0 });
    const { isColliding, normal, overlap } = getBoxCircleCollision(entityA, entityB);
    expect(isColliding).toBe(true);
    expect(normal).toEqual({ x: -1, y: 0 });
    expect(overlap).toBe(16);
  });

  it('Should return no collision data when passed a non-colliding box and circle', () => {
    transform2dComponentB.position = new Vector2d({ x: 100, y: 100 });
    const { isColliding } = getBoxCircleCollision(entityA, entityB);
    expect(isColliding).toBe(false);
  });
});