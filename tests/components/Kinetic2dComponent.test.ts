import { describe, expect, it } from 'vitest';
import { Kinetic2dComponent } from '#/components';

describe('Kinetic2dComponent', () => {
  it('Should instantiate', () => {
    const velocity = { x: 0, y: 0 };
    const acceleration = { x: 0, y: 0 };
    const mass = 1;
    const kinetic2dComponent = new Kinetic2dComponent({
      velocity,
      acceleration,
      mass,
    });
    expect(kinetic2dComponent).toBeInstanceOf(Kinetic2dComponent);
    expect(kinetic2dComponent.name).toBe('Kinetic2d');
    expect(kinetic2dComponent.velocity).toEqual(velocity);
    expect(kinetic2dComponent.acceleration).toEqual(acceleration);
    expect(kinetic2dComponent.mass).toBe(mass);
  });
});
