import { Collider2dComponent, RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { resolveCollision } from '#/systems/collision2dSystem/logic';
import { beforeEach, describe, expect, it } from 'vitest';

describe('resolveCollision', () => {
  const radius = 16;
  const speed = 5;

  let entityA: Entity;
  let entityB: Entity;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;
  let rigidBodyA: RigidBody2dComponent;
  let rigidBodyB: RigidBody2dComponent;

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
        new RigidBody2dComponent(),
        new Transform2dComponent(),
      ]);
    });
    transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
    transformB = entityB.getComponent<Transform2dComponent>('Transform2d');
    rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
    rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');
  });

  it('Should correct the positions of overlapping entities', () => {
    transformB.position = new Vector2d({ x: 1, y: 1 });
    resolveCollision(entityA, entityB);
    const distance = transformA.position.subtract(transformB.position).getLength();
    expect(distance).toBeCloseTo(radius * 2);
  });

  it('Should transfer the velocities of overlapping entities', () => {
    const restitution = 1;
    rigidBodyA.restitution = restitution;
    rigidBodyB.restitution = restitution;
    rigidBodyA.velocity = new Vector2d({ x: speed, y: 0 });
    transformA.position = new Vector2d({ x: -radius, y: 0 });
    resolveCollision(entityA, entityB);
    expect(rigidBodyA.velocity).toEqual(new Vector2d({ x: 0, y: 0 }));
    expect(rigidBodyB.velocity).toEqual(new Vector2d({ x: speed, y: 0 }));
  });

  it('Should scale transferred velocity based on mass', () => {
    rigidBodyA.mass = 10;
    rigidBodyB.mass = 1;
    rigidBodyA.velocity = new Vector2d({ x: speed, y: 0 });
    transformA.position = new Vector2d({ x: -radius, y: 0 });
    resolveCollision(entityA, entityB);
    expect(rigidBodyA.velocity).toEqual(new Vector2d({ x: speed * 0.1, y: 0 }));
    expect(rigidBodyB.velocity).toEqual(new Vector2d({ x: speed * 0.9, y: 0 }));
  });

  it('Should reduce overall velocity based on restitution', () => {
    const restitution = 0.5;
    rigidBodyA.restitution = restitution;
    rigidBodyB.restitution = restitution;
    rigidBodyA.velocity = new Vector2d({ x: speed, y: speed });
    rigidBodyB.velocity = new Vector2d({ x: -speed, y: -speed });
    transformA.position = new Vector2d({ x: -radius, y: -radius });
    resolveCollision(entityA, entityB);
    expect(rigidBodyA.velocity.x).toBeCloseTo(-speed * restitution);
    expect(rigidBodyA.velocity.y).toBeCloseTo(-speed * restitution);
    expect(rigidBodyB.velocity.x).toBeCloseTo(speed * restitution);
    expect(rigidBodyB.velocity.y).toBeCloseTo(speed * restitution);
  });
});
