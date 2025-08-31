import { describe, expect, it } from 'vitest';
import { RigidBody2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';

describe('RigidBody2dComponent', () => {
  it('Should instantiate', () => {
    const rigidBody2dComponent = new RigidBody2dComponent();
    expect(rigidBody2dComponent).toBeInstanceOf(RigidBody2dComponent);
    expect(rigidBody2dComponent.name).toBe('RigidBody2d');
    expect(rigidBody2dComponent.velocity).toBeInstanceOf(Vector2d);
    expect(rigidBody2dComponent.velocity.x).toBe(0);
    expect(rigidBody2dComponent.velocity.y).toBe(0);
    expect(rigidBody2dComponent.acceleration).toBeInstanceOf(Vector2d);
    expect(rigidBody2dComponent.acceleration.x).toBe(0);
    expect(rigidBody2dComponent.acceleration.y).toBe(0);
    expect(rigidBody2dComponent.impulse).toBeInstanceOf(Vector2d);
    expect(rigidBody2dComponent.impulse.x).toBe(0);
    expect(rigidBody2dComponent.impulse.y).toBe(0);
    expect(rigidBody2dComponent.mass).toBe(1);
    expect(rigidBody2dComponent.inverseMass).toBe(1);
  });
});
