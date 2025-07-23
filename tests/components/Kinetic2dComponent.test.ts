import { describe, expect, it } from 'vitest';
import { Kinetic2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';

describe('Kinetic2dComponent', () => {
  it('Should instantiate', () => {
    const kinetic2dComponent = new Kinetic2dComponent();
    expect(kinetic2dComponent).toBeInstanceOf(Kinetic2dComponent);
    expect(kinetic2dComponent.name).toBe('Kinetic2d');
    expect(kinetic2dComponent.velocity).toBeInstanceOf(Vector2d);
    expect(kinetic2dComponent.velocity.x).toBe(0);
    expect(kinetic2dComponent.velocity.y).toBe(0);
    expect(kinetic2dComponent.acceleration).toBeInstanceOf(Vector2d);
    expect(kinetic2dComponent.acceleration.x).toBe(0);
    expect(kinetic2dComponent.acceleration.y).toBe(0);
    expect(kinetic2dComponent.mass).toBe(1);
  });
});
