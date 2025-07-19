import { Kinetic2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { kinetic2dSystem } from '#/systems';
import { describe, expect, it } from 'vitest';

describe('kinetic2dSystem', () => {
  it('Should alter add the velocity of a component to its transform', () => {
    const entity = new Entity();
    const transformComponent = new Transform2dComponent({
      position: { x: 0, y: 0 },
    });
    const kinetic2dComponent = new Kinetic2dComponent({
      velocity: { x: 1, y: 2 },
    });
    entity.addComponent(transformComponent);
    entity.addComponent(kinetic2dComponent);
    kinetic2dSystem([entity]);
    expect(transformComponent.position.x).toBe(1);
    expect(transformComponent.position.y).toBe(2);
  });
});
