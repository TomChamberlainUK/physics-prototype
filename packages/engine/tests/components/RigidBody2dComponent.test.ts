import { describe, expect, it } from 'vitest';
import { RigidBody2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';

describe('RigidBody2dComponent', () => {
  describe('constructor()', () => {
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
      expect(rigidBody2dComponent.force).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.force.x).toBe(0);
      expect(rigidBody2dComponent.force.y).toBe(0);
      expect(rigidBody2dComponent.impulse).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.impulse.x).toBe(0);
      expect(rigidBody2dComponent.impulse.y).toBe(0);
      expect(rigidBody2dComponent.mass).toBe(1);
      expect(rigidBody2dComponent.inverseMass).toBe(1);
      expect(rigidBody2dComponent.momentOfInertia).toBe(null);
      expect(rigidBody2dComponent.inverseMomentOfInertia).toBe(null);
      expect(rigidBody2dComponent.restitution).toBe(0.8);
      expect(rigidBody2dComponent.friction).toBe(0.3);
      expect(rigidBody2dComponent.angularVelocity).toBe(0);
      expect(rigidBody2dComponent.angularAcceleration).toBe(0);
      expect(rigidBody2dComponent.angularImpulse).toBe(0);
    });
  });

  describe('get mass()', () => {
    it('Should return the mass', () => {
      const rigidBody2dComponent = new RigidBody2dComponent({ mass: 5 });
      expect(rigidBody2dComponent.mass).toBe(5);
    });
  });

  describe('set mass()', () => {
    it('Should set the mass and update the inverse mass accordingly', () => {
      const rigidBody2dComponent = new RigidBody2dComponent();
      rigidBody2dComponent.mass = 2;
      expect(rigidBody2dComponent.mass).toBe(2);
      expect(rigidBody2dComponent.inverseMass).toBe(0.5);
    });

    describe('When mass is set to 0', () => {
      it('Should set inverse mass to 0', () => {
        const rigidBody2dComponent = new RigidBody2dComponent({ mass: 10 });
        rigidBody2dComponent.mass = 0;
        expect(rigidBody2dComponent.mass).toBe(0);
        expect(rigidBody2dComponent.inverseMass).toBe(0);
      });
    });
  });

  describe('get restitution()', () => {
    it('Should return the restitution', () => {
      const rigidBody2dComponent = new RigidBody2dComponent({ restitution: 0.5 });
      expect(rigidBody2dComponent.restitution).toBe(0.5);
    });
  });

  describe('set restitution()', () => {
    it('Should set the restitution', () => {
      const rigidBody2dComponent = new RigidBody2dComponent();
      rigidBody2dComponent.restitution = 0.9;
      expect(rigidBody2dComponent.restitution).toBe(0.9);
    });

    describe('When restitution is set below 0', () => {
      it('Should throw an error', () => {
        const rigidBody2dComponent = new RigidBody2dComponent();
        expect(() => {
          rigidBody2dComponent.restitution = -0.1;
        }).toThrowError('Restitution must be between 0 and 1.');
      });
    });

    describe('When restitution is set above 1', () => {
      it('Should throw an error', () => {
        const rigidBody2dComponent = new RigidBody2dComponent();
        expect(() => {
          rigidBody2dComponent.restitution = 1.1;
        }).toThrowError('Restitution must be between 0 and 1.');
      });
    });
  });
});
