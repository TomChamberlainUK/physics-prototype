import { Kinetic2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import { kinetic2dSystem } from '#/systems';
import { describe, expect, it } from 'vitest';

describe('kinetic2dSystem', () => {
  it('Should increase an entity\'s velocity by its impulse and then reduce its impulse to zero', () => {
    const entity = new Entity();
    const transformComponent = new Transform2dComponent();
    const kinetic2dComponent = new Kinetic2dComponent({
      impulse: new Vector2d({ x: 1, y: 2 }),
    });
    entity.addComponents([
      transformComponent,
      kinetic2dComponent,
    ]);
    kinetic2dSystem([entity]);
    expect(kinetic2dComponent.velocity).toBeInstanceOf(Vector2d);
    expect(kinetic2dComponent.velocity.x).toBe(1);
    expect(kinetic2dComponent.velocity.y).toBe(2);
    expect(kinetic2dComponent.impulse).toBeInstanceOf(Vector2d);
    expect(kinetic2dComponent.impulse.x).toBe(0);
    expect(kinetic2dComponent.impulse.y).toBe(0);
  });

  it('Should increase an entity\'s velocity by its acceleration', () => {
    const entity = new Entity();
    const transformComponent = new Transform2dComponent();
    const kinetic2dComponent = new Kinetic2dComponent({
      acceleration: new Vector2d({ x: 0, y: 0 }),
      velocity: new Vector2d({ x: 1, y: 2 }),
    });
    entity.addComponents([
      transformComponent,
      kinetic2dComponent,
    ]);
    kinetic2dSystem([entity]);
    expect(kinetic2dComponent.velocity).toBeInstanceOf(Vector2d);
    expect(kinetic2dComponent.velocity.x).toBe(1);
    expect(kinetic2dComponent.velocity.y).toBe(2);
  });

  it('Should increase an entity\'s position by its velocity', () => {
    const entity = new Entity();
    const transformComponent = new Transform2dComponent({
      position: new Vector2d({ x: 0, y: 0 }),
    });
    const kinetic2dComponent = new Kinetic2dComponent({
      velocity: new Vector2d({ x: 1, y: 2 }),
    });
    entity.addComponents([
      transformComponent,
      kinetic2dComponent,
    ]);
    kinetic2dSystem([entity]);
    expect(transformComponent.position).toBeInstanceOf(Vector2d);
    expect(transformComponent.position.x).toBe(1);
    expect(transformComponent.position.y).toBe(2);
  });
});
